# Twitch OAuth 2.0 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OAuth 2.0 + OpenID Connect |
| 開發者平台 | [Twitch Developer Console](https://dev.twitch.tv/console/apps) |
| Token 類型 | Bearer |
| 預設 Scopes | `openid` `user:read:email` |
| PKCE | 支援但非必要 |

## 步驟

### 1. 註冊 Application

1. 到 [Twitch Developer Console](https://dev.twitch.tv/console/apps)
2. 點擊 **Register Your Application**
3. 填入：

| 欄位 | 範例值 |
|------|--------|
| Name | OAuth Showcase |
| OAuth Redirect URLs | `https://your-domain.com/auth/callback/twitch` |
| Category | Website Integration |

4. Create

### 2. 取得 Credentials

1. 點擊剛建立的 Application → Manage
2. 複製 **Client ID**
3. 點擊 **New Secret** 產生 Client Secret

### 3. 設定環境變數

```env
TWITCH_CLIENT_ID=your-client-id
TWITCH_CLIENT_SECRET=your-client-secret
```

## 注意事項

- Twitch 使用者名稱可能跟顯示名稱不同（display_name vs login）
- 可以加入多個 Redirect URL
- Token 預設 4 小時過期
- Twitch 支援 OIDC，所以可以取得 id_token

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "display_name",
  "email": "user@example.com",
  "image": "https://static-cdn.jtvnw.net/jtv_user_pictures/xxx.png"
}
```

## 常見問題

### Invalid redirect URI
- Twitch 允許多個 redirect URI，但請求時必須跟其中一個完全匹配

### 拿不到 email
- 使用者的 Twitch 帳號必須有驗證過的 email
- Scope 需要包含 `user:read:email`
