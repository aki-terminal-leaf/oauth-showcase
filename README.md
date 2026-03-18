# 🔐 OAuth Showcase

Third-party authentication demo using [Auth.js](https://authjs.dev/) with a decoupled frontend/backend architecture.

## Architecture

```
frontend/       React + Vite + Tailwind (swappable — Vue, Svelte, plain HTML all work)
backend/        Express + Auth.js + SQLite (Drizzle ORM)
```

The backend handles all OAuth flows. The frontend is a thin client that redirects to backend auth endpoints.

## Supported Providers

| Provider | Protocol | Callback URL |
|----------|----------|-------------|
| 🔵 Google | OpenID Connect | `/api/auth/callback/google` |
| ⚫ GitHub | OAuth 2.0 | `/api/auth/callback/github` |
| 🟣 Discord | OAuth 2.0 | `/api/auth/callback/discord` |
| ⬛ X (Twitter) | OAuth 2.0 + PKCE | `/api/auth/callback/twitter` |
| 🟢 LINE | OpenID Connect | `/api/auth/callback/line` |
| 🍎 Apple | OpenID Connect | `/api/auth/callback/apple` |
| 🔷 Microsoft | OpenID Connect | `/api/auth/callback/microsoft-entra-id` |
| 🟪 Twitch | OAuth 2.0 | `/api/auth/callback/twitch` |

## Quick Start

```bash
# Install dependencies
npm install

# Copy and configure OAuth credentials
cp backend/.env.example backend/.env

# Run both frontend + backend
npm run dev
```

- Backend: http://localhost:3001
- Frontend: http://localhost:5173

## Setup OAuth Credentials

### Google
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create OAuth 2.0 Client ID
2. Redirect URI: `http://localhost:3001/api/auth/callback/google`

### GitHub
1. [GitHub Developer Settings](https://github.com/settings/developers) → New OAuth App
2. Callback URL: `http://localhost:3001/api/auth/callback/github`

### Discord
1. [Discord Developer Portal](https://discord.com/developers/applications) → New Application → OAuth2
2. Redirect URL: `http://localhost:3001/api/auth/callback/discord`

### X (Twitter)
1. [X Developer Portal](https://developer.x.com/en/portal/dashboard) → Create Project & App
2. OAuth 2.0 Settings → Callback URL: `http://localhost:3001/api/auth/callback/twitter`
3. Enable OAuth 2.0 with PKCE

### LINE
1. [LINE Developers Console](https://developers.line.biz/console/) → Create Channel (LINE Login)
2. Callback URL: `http://localhost:3001/api/auth/callback/line`

### Apple
1. [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId) → Register Services ID
2. Configure Sign In with Apple → Return URL: `http://localhost:3001/api/auth/callback/apple`
3. Generate client secret (requires private key)

### Microsoft (Azure AD / Entra ID)
1. [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps) → New Registration
2. Redirect URI: `http://localhost:3001/api/auth/callback/microsoft-entra-id`
3. Set `AZURE_AD_TENANT_ID=common` for multi-tenant

### Twitch
1. [Twitch Developer Console](https://dev.twitch.tv/console/apps) → Register Your Application
2. OAuth Redirect URL: `http://localhost:3001/api/auth/callback/twitch`

## Project Structure

```
backend/
  src/
    index.ts            Express server + Auth.js config (all providers)
    db/
      schema.ts         SQLite schema (users, accounts, sessions)
      index.ts          Database connection
  .env.example          Environment variable template

frontend/
  src/
    App.tsx             Login UI + session display
    main.tsx            Entry point
    index.css           Tailwind styles
```

## Branches

- **main** — Stable base with all providers
- **tool** — Production-ready auth modules (coming soon)
- **docs** — Platform-specific guides and tutorials (coming soon)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Auth | Auth.js v5 |
| Backend | Express 4 |
| Database | SQLite + Drizzle ORM |
| Frontend | React 19 + Vite 6 |
| Styling | Tailwind CSS |

## License

MIT
