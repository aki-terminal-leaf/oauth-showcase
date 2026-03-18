# LINE Login 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OpenID Connect |
| 開發者平台 | [LINE Developers Console](https://developers.line.biz/console/) |
| Token 類型 | Bearer |
| 預設 Scopes | `openid` `profile` `email` |
| PKCE | 支援但非必要 |

## 步驟

### 1. 建立 Provider & Channel

1. 到 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立 Provider（或選擇現有的）
3. 建立 Channel → 類型選 **LINE Login**

### 2. 設定 Channel

1. Basic settings → 記下 **Channel ID** 和 **Channel secret**
2. LINE Login settings → Callback URL 加入：

```
https://your-domain.com/auth/callback/line
```

3. 確認 **Email address permission** 已申請（需要額外申請）

### 3. 設定環境變數

```env
LINE_CLIENT_ID=your-channel-id
LINE_CLIENT_SECRET=your-channel-secret
```

## 注意事項

- LINE 的 Client ID 就是 **Channel ID**（純數字）
- Email 不是預設提供的，需要在 Channel 設定中申請 **Email address permission**
- 申請 email 權限需要填寫用途，LINE 會審核
- LINE Login 支援 LIFF（LINE Front-end Framework）整合
- 日本以外地區的使用者可能沒有 LINE 帳號

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "使用者名稱",
  "email": "user@example.com",
  "image": "https://profile.line-scdn.net/xxx"
}
```

## 常見問題

### Invalid redirect_uri
- LINE 的 Callback URL 必須是 https（開發環境也是）
- 可以用 tunnel（如 Cloudflare Tunnel）解決

### 拿不到 email
- 確認已申請 Email address permission 並通過審核
- 使用者的 LINE 帳號必須有綁定 email
