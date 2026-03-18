# Google OAuth 2.0 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OpenID Connect |
| 開發者平台 | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| Token 類型 | Bearer |
| 預設 Scopes | `openid` `email` `profile` |
| PKCE | 支援但非必要 |

## 步驟

### 1. 建立 Google Cloud 專案

1. 到 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案（或選擇現有專案）

### 2. 設定 OAuth 同意畫面

1. 左側選單 → APIs & Services → OAuth consent screen
2. 選擇 **External**（除非是 Google Workspace 內部用）
3. 填入：
   - App name
   - User support email
   - Developer contact email
4. Scopes 加入 `email` 和 `profile`
5. 如果是測試階段，加入測試使用者的 email

### 3. 建立 OAuth 2.0 Client ID

1. APIs & Services → Credentials → Create Credentials → OAuth Client ID
2. Application type: **Web application**
3. 填入：

| 欄位 | 範例值 |
|------|--------|
| Name | OAuth Showcase |
| Authorized JavaScript origins | `https://your-domain.com` |
| Authorized redirect URIs | `https://your-domain.com/auth/callback/google` |

4. 點擊 Create，取得 Client ID 和 Client Secret

### 4. 設定環境變數

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## 注意事項

- Google Client ID 格式固定為 `xxx.apps.googleusercontent.com`
- 測試階段（Publishing status: Testing）最多 100 個測試使用者
- 要給所有使用者用，需要提交驗證（Google 會審查）
- Authorized JavaScript origins 和 redirect URIs 都要設定
- `localhost` 開發環境不需要 https

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "小秋 Aki",
  "email": "aki.terminal.leaf@gmail.com",
  "image": "https://lh3.googleusercontent.com/a/xxxxx"
}
```

## 常見問題

### Error 403: access_denied
- 確認使用者的 email 有在測試使用者名單中（Testing 階段）
- 或將 App 提交驗證改為 Production

### Error 400: redirect_uri_mismatch
- Authorized redirect URIs 必須完全匹配
- 注意結尾不要多 `/`

### Token 過期
- Access token 預設 1 小時過期
- 使用 refresh token 取得新的 access token
