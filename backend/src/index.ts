import "dotenv/config";
import express from "express";
import cors from "cors";
import { ExpressAuth } from "@auth/express";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/express/providers/google";
import GitHub from "@auth/express/providers/github";
import { db } from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS for frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Trust proxy (for secure cookies behind reverse proxy)
app.set("trust proxy", 1);

// Auth.js middleware
app.use(
  "/api/auth/*",
  ExpressAuth({
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
    ],
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
  })
);

// API: Current user info
app.get("/api/me", async (req, res) => {
  // @ts-expect-error auth is added by middleware
  const session = req.auth;
  if (!session?.user) {
    return res.json({ user: null });
  }
  res.json({ user: session.user });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", providers: ["google", "github"] });
});

app.listen(PORT, () => {
  console.log(`🔐 OAuth Showcase Backend running on http://localhost:${PORT}`);
  console.log(`   Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  console.log(`   Frontend URL: ${FRONTEND_URL}`);
});
