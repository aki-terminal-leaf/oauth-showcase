# OAuth Showcase — 文件

## Provider 設定指南

每個 provider 的完整設定流程、注意事項和踩坑記錄。

| Provider | 協議 | 難度 | 費用 | 指南 |
|----------|------|------|------|------|
| [Google](providers/google.md) | OpenID Connect | ⭐⭐ | 免費 | 需設定 OAuth 同意畫面 |
| [GitHub](providers/github.md) | OAuth 2.0 | ⭐ | 免費 | 最簡單的起點 |
| [Discord](providers/discord.md) | OAuth 2.0 | ⭐ | 免費 | 幾分鐘搞定 |
| [X (Twitter)](providers/twitter.md) | OAuth 2.0 + PKCE | ⭐⭐⭐ | 免費 | 需申請 Developer access |
| [LINE](providers/line.md) | OpenID Connect | ⭐⭐ | 免費 | Email 需額外申請 |
| [Apple](providers/apple.md) | OpenID Connect | ⭐⭐⭐⭐ | $99/年 | Client Secret 是動態 JWT |
| [Microsoft](providers/microsoft.md) | OpenID Connect | ⭐⭐ | 免費 | Tenant 設定需注意 |
| [Twitch](providers/twitch.md) | OAuth 2.0 + OIDC | ⭐ | 免費 | 直覺好設定 |

## 建議順序

如果你是第一次實作第三方登入，建議按以下順序：

1. **GitHub** — 最簡單，5 分鐘搞定
2. **Google** — 最常用，但需要設定 OAuth 同意畫面
3. **Discord** — 跟 GitHub 一樣簡單
4. **Twitch** — 類似 Discord
5. **Microsoft** — 需要理解 tenant 概念
6. **LINE** — 亞洲市場必備，email 需額外申請
7. **X (Twitter)** — 需要 Developer access 審核
8. **Apple** — 最複雜，但 iOS App 可能強制要求

## 授權後的應用

拿到 token 之後能做什麼？各平台的 API 能力、進階 scope、程式碼範例和實際應用場景。

→ [授權後的應用](after-auth.md)

---

## 共通注意事項

### Callback URL
- 所有 provider 的 callback URL 格式：`https://your-domain.com/auth/callback/{provider-id}`
- 開發環境可以用 `http://localhost`（除了 Apple 和 LINE）
- 用 tunnel（Cloudflare Tunnel、ngrok）可以解決 https 需求

### CSRF Protection
- Auth.js 的 signin/signout 需要 POST 方法 + CSRF token
- 先 GET `/auth/csrf` 取得 token，再 POST 帶入

### Cookie 設定
- 跨域部署時注意 `SameSite` 和 `Secure` cookie 設定
- 使用 tunnel 時通常不會有問題（已經是 https）

### Secret 管理
- 所有 Client Secret 都不該 commit 到 repository
- 使用 `.env` 檔案 + `.gitignore`
- 生產環境用環境變數或 secret manager
