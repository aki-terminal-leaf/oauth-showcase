import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { ExpressAuth } from "@auth/express";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/express/providers/google";
import GitHub from "@auth/express/providers/github";
import Discord from "@auth/express/providers/discord";
import Twitter from "@auth/express/providers/twitter";
import LINE from "@auth/express/providers/line";
import Apple from "@auth/express/providers/apple";
import MicrosoftEntraId from "@auth/express/providers/microsoft-entra-id";
import Twitch from "@auth/express/providers/twitch";
import { db } from "./db/index.js";
import { eq } from "drizzle-orm";
import { accounts, users } from "./db/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.set("trust proxy", 1);

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
  Discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
  }),
  Twitter({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  }),
  LINE({
    clientId: process.env.LINE_CLIENT_ID,
    clientSecret: process.env.LINE_CLIENT_SECRET,
  }),
  Apple({
    clientId: process.env.APPLE_CLIENT_ID,
    clientSecret: process.env.APPLE_CLIENT_SECRET!,
  }),
  MicrosoftEntraId({
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID,
  }),
  Twitch({
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
  }),
];

app.use(
  "/auth/*",
  ExpressAuth({
    providers,
    adapter: DrizzleAdapter(db),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    events: {
      async signIn({ user, profile }) {
        // Update user image on every sign-in
        if (user.id && profile?.image) {
          await db
            .update(users)
            .set({ image: profile.image })
            .where(eq(users.id, user.id));
        }
      },
    },
    callbacks: {
      async session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;

          const userAccounts = await db
            .select({
              provider: accounts.provider,
              scope: accounts.scope,
              token_type: accounts.token_type,
            })
            .from(accounts)
            .where(eq(accounts.userId, user.id));

          (session as any).account = userAccounts[0] ?? null;
          (session as any).linkedProviders = userAccounts.map((a) => ({
            provider: a.provider,
            scope: a.scope,
          }));
        }
        return session;
      },
    },
  })
);

app.get("/api/providers", (_req, res) => {
  const available = providers
    .map((p) => {
      const provider = typeof p === "function" ? p() : p;
      return provider.id;
    })
    .filter(Boolean);
  res.json({ providers: available });
});

app.get("/api/me", async (req, res) => {
  // @ts-expect-error auth is added by middleware
  const session = req.auth;
  if (!session?.user) {
    return res.json({ user: null });
  }
  res.json({ user: session.user });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    providers: ["google", "github", "discord", "twitter", "line", "apple", "microsoft-entra-id", "twitch"],
  });
});

// Serve frontend static files
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🔐 OAuth Showcase running on http://localhost:${PORT}`);
  console.log(`   Providers: Google, GitHub, Discord, X, LINE, Apple, Azure AD, Twitch`);
  console.log(`   Serving frontend from: ${frontendDist}`);
});
