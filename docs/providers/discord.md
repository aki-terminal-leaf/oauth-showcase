# Discord OAuth 2.0 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OAuth 2.0 |
| 開發者平台 | [Discord Developer Portal](https://discord.com/developers/applications) |
| Token 類型 | Bearer |
| 預設 Scopes | `identify` `email` |
| PKCE | 不需要 |

## 步驟

### 1. 建立 Application

1. 到 [Discord Developer Portal](https://discord.com/developers/applications)
2. 點擊 **New Application**
3. 輸入名稱 → Create

### 2. 設定 OAuth2

1. 左側選單 → OAuth2
2. 複製 **Client ID** 和 **Client Secret**
3. 在 Redirects 加入：

```
https://your-domain.com/auth/callback/discord
```

### 3. 設定環境變數

```env
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
```

## 注意事項

- Discord 的 Client Secret 可以重新產生，舊的會立刻失效
- `identify` scope 只回傳使用者名稱和大頭照，要 email 需加 `email` scope
- 使用者必須有驗證過的 email 才能透過 `email` scope 取得
- Rate limit: 每個 IP 每秒 50 requests

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "username",
  "email": "user@example.com",
  "image": "https://cdn.discordapp.com/avatars/xxx/xxx.png"
}
```

## 常見問題

### Invalid OAuth2 redirect_uri
- Redirect URL 必須完全匹配，包含 protocol
- 開發環境用 `http://localhost:3001/auth/callback/discord`

### 使用者拒絕授權
- Auth.js 會導向 `/auth/error?error=AccessDenied`
- 建議在 frontend 處理這個 error query parameter
