# Microsoft (Azure AD / Entra ID) 設定指南

## 概要

| 項目 | 說明 |
|------|------|
| 協議 | OpenID Connect |
| 開發者平台 | [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps) |
| Token 類型 | Bearer |
| 預設 Scopes | `openid` `profile` `email` `User.Read` |
| PKCE | 支援 |
| 費用 | 免費（Azure 帳號即可）|

## 步驟

### 1. 註冊 Application

1. 到 [Azure Portal → App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
2. 點擊 **New registration**
3. 填入：

| 欄位 | 範例值 |
|------|--------|
| Name | OAuth Showcase |
| Supported account types | Accounts in any organizational directory and personal Microsoft accounts |
| Redirect URI (Web) | `https://your-domain.com/auth/callback/microsoft-entra-id` |

4. Register

### 2. 取得 Credentials

1. Overview → 複製 **Application (client) ID** 和 **Directory (tenant) ID**
2. Certificates & secrets → New client secret → 複製 Value

### 3. 設定環境變數

```env
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=common
```

### Tenant ID 說明

| 值 | 說明 |
|----|------|
| `common` | 接受所有 Microsoft 帳號（個人 + 組織）|
| `organizations` | 只接受組織帳號 |
| `consumers` | 只接受個人 Microsoft 帳號 |
| 具體 tenant ID | 只接受特定組織 |

## 注意事項

- Auth.js 中 provider 名稱是 `microsoft-entra-id`（舊名 Azure AD）
- Callback URL 中也是 `microsoft-entra-id` 不是 `microsoft`
- Client Secret 有過期時間（預設最長 2 年），需要定期更新
- 個人 Microsoft 帳號和組織帳號的 token 格式略有不同

## 回傳資料範例

```json
{
  "id": "user-id",
  "name": "小秋 Aki",
  "email": "user@outlook.com",
  "image": null
}
```

> ⚠️ Microsoft 預設不回傳大頭照 URL，需要額外用 Microsoft Graph API 取得

## 常見問題

### AADSTS50011: redirect_uri does not match
- 確認 Azure Portal 中的 Redirect URI 完全匹配
- 注意 `microsoft-entra-id` 不是 `microsoft`

### AADSTS700016: Application not found
- 確認 Client ID 正確
- 確認 Application 所在的 tenant
