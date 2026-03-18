# Apple Sign In 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OpenID Connect |
| 開發者平台 | [Apple Developer](https://developer.apple.com/account/) |
| Token 類型 | Bearer |
| 預設 Scopes | `name` `email` |
| PKCE | 支援 |
| 費用 | 需要 Apple Developer Program（$99/年）|

## 步驟

### 1. 前置條件

- 需要加入 [Apple Developer Program](https://developer.apple.com/programs/)（$99/年）
- 需要有 App ID

### 2. 建立 Services ID

1. Apple Developer → Certificates, Identifiers & Profiles
2. Identifiers → 點 + → 選 **Services IDs**
3. 填入 Description 和 Identifier
4. 啟用 **Sign In with Apple**
5. Configure → 設定：

| 欄位 | 範例值 |
|------|--------|
| Domains | `your-domain.com` |
| Return URLs | `https://your-domain.com/auth/callback/apple` |

### 3. 產生 Client Secret

Apple 的 Client Secret 不是固定值，需要用 private key 產生 JWT：

1. Keys → 建立新 Key → 啟用 Sign In with Apple
2. 下載 `.p8` private key 檔案
3. 用以下資訊產生 JWT：
   - Team ID
   - Key ID
   - Services ID (Client ID)
   - Private key (.p8)

```javascript
// 產生 client secret 的範例（需要 jsonwebtoken 套件）
const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKey = fs.readFileSync('AuthKey_XXXXX.p8');
const secret = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: 'YOUR_TEAM_ID',
  subject: 'YOUR_SERVICE_ID',
  keyid: 'YOUR_KEY_ID',
});
```

### 4. 設定環境變數

```env
APPLE_CLIENT_ID=your-services-id
APPLE_CLIENT_SECRET=generated-jwt-secret
```

## 注意事項

- **最複雜的 provider** — Client Secret 是動態產生的 JWT，最長有效期 180 天
- Apple 只在**第一次授權**時回傳使用者的 name 和 email，之後不會再給
- 必須儲存第一次收到的使用者資料
- Return URL 必須是 https
- 如果 App 有上架 App Store，Apple 會**強制要求**支援 Sign In with Apple

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "小秋 Aki",
  "email": "xxxxx@privaterelay.appleid.com",
  "image": null
}
```

> ⚠️ Apple 預設使用 Private Email Relay，使用者的真實 email 會被隱藏

## 常見問題

### invalid_client
- Client Secret (JWT) 可能過期，需要重新產生
- 確認 Team ID、Key ID、Services ID 都正確

### 拿不到 name
- Apple 只在第一次授權時提供 name
- 使用者可以在 Apple ID 設定中撤銷授權，撤銷後重新授權才會再次提供

### redirect_uri 不匹配
- Apple 對 redirect_uri 非常嚴格
- 不支援 localhost，開發環境必須用 tunnel
