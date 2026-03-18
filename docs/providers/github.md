# GitHub OAuth 2.0 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OAuth 2.0 |
| 開發者平台 | [GitHub Developer Settings](https://github.com/settings/developers) |
| Token 類型 | Bearer |
| 預設 Scopes | `read:user` `user:email` |
| PKCE | 不需要 |

## 步驟

### 1. 建立 OAuth App

1. 登入 GitHub → Settings → Developer settings → OAuth Apps
2. 點擊 **New OAuth App**
3. 填入以下資訊：

| 欄位 | 範例值 |
|------|--------|
| Application name | OAuth Showcase |
| Homepage URL | `https://your-domain.com` |
| Authorization callback URL | `https://your-domain.com/auth/callback/github` |

4. 點擊 **Register application**

### 2. 取得 Credentials

- 建立成功後會看到 **Client ID**
- 點擊 **Generate a new client secret** 產生 Client Secret
- ⚠️ Secret 只會顯示一次，立刻複製保存

### 3. 設定環境變數

```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### 4. Callback URL 格式

```
https://your-domain.com/auth/callback/github
```

開發環境：
```
http://localhost:3001/auth/callback/github
```

## 注意事項

- GitHub OAuth App 和 GitHub App 是不同的東西，這裡用的是 **OAuth App**
- 一個 OAuth App 只能設定一個 Callback URL
- 如果需要多個環境（dev/staging/prod），建議各建一個 OAuth App
- GitHub 不要求 PKCE，但支援 state parameter 防 CSRF

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "小秋 Aki",
  "email": "aki.terminal.leaf@gmail.com",
  "image": "https://avatars.githubusercontent.com/u/xxxxx"
}
```

## 常見問題

### redirect_uri_mismatch
Callback URL 必須跟 OAuth App 設定的完全一致，包含 protocol（http/https）和 path。

### Application suspended
如果 App 被 GitHub 暫停，通常是因為違反 ToS。檢查是否有異常的 API 呼叫量。
