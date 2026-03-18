# X (Twitter) OAuth 2.0 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OAuth 2.0 + PKCE |
| 開發者平台 | [X Developer Portal](https://developer.x.com/en/portal/dashboard) |
| Token 類型 | Bearer |
| 預設 Scopes | `users.read` `tweet.read` |
| PKCE | **必要** |

## 步驟

### 1. 申請開發者帳號

1. 到 [X Developer Portal](https://developer.x.com/en/portal/dashboard)
2. 申請 Developer access（需要填寫用途說明）
3. 審核通過後進入 Dashboard

### 2. 建立 Project & App

1. Dashboard → Create Project
2. 填入 Project name、Use case
3. 建立 App

### 3. 設定 OAuth 2.0

1. App Settings → User authentication settings → Set up
2. 選擇 **OAuth 2.0**
3. Type of App: **Web App**
4. 填入：

| 欄位 | 範例值 |
|------|--------|
| Callback URI | `https://your-domain.com/auth/callback/twitter` |
| Website URL | `https://your-domain.com` |

5. Save → 取得 Client ID 和 Client Secret

### 4. 設定環境變數

```env
TWITTER_CLIENT_ID=your-client-id
TWITTER_CLIENT_SECRET=your-client-secret
```

## 注意事項

- X 強制使用 **PKCE**（Proof Key for Code Exchange），Auth.js 會自動處理
- Free tier 有 API 限制（每月 1,500 tweets read，但 OAuth 登入本身不受此限）
- OAuth 1.0a 和 2.0 是不同的設定，Auth.js 用的是 **2.0**
- Client Secret 建立後只顯示一次
- Developer Portal 審核可能需要 1-2 天

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "小秋 Aki",
  "email": null,
  "image": "https://pbs.twimg.com/profile_images/xxx/xxx.jpg"
}
```

> ⚠️ X OAuth 2.0 預設不回傳 email，需要額外申請 elevated access

## 常見問題

### Invalid request: Value passed for the authorization code was invalid
- PKCE code_verifier 不匹配，通常是 session 問題
- 確認 cookie 設定正確（SameSite、Secure）

### 403 Forbidden
- 確認 Developer account 已啟用
- 確認 App 的 OAuth 2.0 有正確設定

### 拿不到 email
- X OAuth 2.0 要取得 email 需要 elevated access
- 可以用 OAuth 1.0a 替代（但設定更複雜）
