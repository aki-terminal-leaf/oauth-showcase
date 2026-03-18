# 🔐 OAuth Showcase

Third-party authentication demo using [Auth.js](https://authjs.dev/) with a decoupled frontend/backend architecture.

## Architecture

```
frontend/          React + Vite + Tailwind (any framework works)
backend/           Express + Auth.js + SQLite (Drizzle ORM)
```

The backend handles all OAuth flows. The frontend is a thin client that redirects to backend auth endpoints. **You can swap the frontend for Vue, Svelte, Angular, or even plain HTML.**

## Supported Providers

- 🔵 Google (OpenID Connect)
- ⚫ GitHub (OAuth 2.0)

More coming soon: Discord, X (Twitter), LINE

## Quick Start

```bash
# Install dependencies
npm install

# Copy and fill in your OAuth credentials
cp backend/.env.example backend/.env

# Run both frontend + backend
npm run dev
```

Backend: `http://localhost:3001`  
Frontend: `http://localhost:5173`

## Setup OAuth Credentials

### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3001/api/auth/callback/google`

### GitHub
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Callback URL: `http://localhost:3001/api/auth/callback/github`

## Project Structure

```
backend/
  src/
    index.ts          Express server + Auth.js config
    db/
      schema.ts       SQLite schema (users, accounts, sessions)
      index.ts        Database connection
  .env.example        Environment template

frontend/
  src/
    App.tsx           Login UI + session display
    main.tsx          Entry point
    index.css         Tailwind styles
```

## Branches

- `main` — Stable base with shared architecture
- `tool` — Production-ready auth modules
- `docs` — Platform-specific guides and tutorials

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Auth | Auth.js (v5) |
| Backend | Express |
| Database | SQLite + Drizzle ORM |
| Frontend | React + Vite |
| Styling | Tailwind CSS |

## License

MIT
