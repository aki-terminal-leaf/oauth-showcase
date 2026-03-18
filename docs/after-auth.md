# 授權後的應用

拿到 OAuth access token 後，你可以用它呼叫各平台的 API。以下整理每個 provider 授權後的實際應用場景和 API 範例。

---

## GitHub

### 可用 API
[GitHub REST API](https://docs.github.com/en/rest) / [GraphQL API](https://docs.github.com/en/graphql)

### 預設 scope 能做的事
`read:user` + `user:email`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `/user` | GET |
| 取得使用者 email 列表 | `/user/emails` | GET |
| 取得使用者的公開 repo | `/user/repos` | GET |
| 取得使用者的星號 repo | `/user/starred` | GET |

### 進階 scope

| Scope | 能做的事 | 應用場景 |
|-------|---------|---------|
| `repo` | 讀寫私有 repo | CI/CD 工具、程式碼分析 |
| `admin:org` | 管理組織 | 組織管理後台 |
| `gist` | 建立/編輯 Gist | 程式碼分享工具 |
| `notifications` | 讀取通知 | 通知聚合器 |
| `workflow` | 觸發 GitHub Actions | 自動化部署 |

### 範例：取得使用者的 repo 列表

```typescript
const repos = await fetch("https://api.github.com/user/repos", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github.v3+json",
  },
});
const data = await repos.json();
// [{ name: "my-repo", full_name: "user/my-repo", private: false, ... }]
```

### 實際應用
- **開發者 Dashboard** — 顯示 repo、PR、issue 統計
- **自動化部署** — 連結 repo 後自動部署（如 Vercel、Netlify）
- **程式碼審查工具** — 讀取 PR、diff，提供 AI 審查
- **徽章/成就系統** — 基於 commit 歷史生成開發者成就

---

## Google

### 可用 API
[Google APIs Explorer](https://developers.google.com/apis-explorer)

### 預設 scope 能做的事
`openid` + `email` + `profile`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `googleapis.com/oauth2/v2/userinfo` | GET |
| 驗證 ID Token | `googleapis.com/tokeninfo` | GET |

### 進階 scope（需在 OAuth 同意畫面申請）

| Scope | 能做的事 | 應用場景 |
|-------|---------|---------|
| `https://www.googleapis.com/auth/calendar` | 讀寫 Google Calendar | 排程工具 |
| `https://www.googleapis.com/auth/drive` | 讀寫 Google Drive | 檔案管理 |
| `https://www.googleapis.com/auth/gmail.readonly` | 讀取 Gmail | 郵件分析 |
| `https://www.googleapis.com/auth/youtube.readonly` | 讀取 YouTube 資料 | 數據儀表板 |
| `https://www.googleapis.com/auth/spreadsheets` | 讀寫 Google Sheets | 資料匯入匯出 |

### 範例：讀取 Google Calendar 事件

```typescript
// 需要 scope: https://www.googleapis.com/auth/calendar.readonly
const events = await fetch(
  "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
  new URLSearchParams({
    timeMin: new Date().toISOString(),
    maxResults: "10",
    orderBy: "startTime",
    singleEvents: "true",
  }),
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
);
const data = await events.json();
// { items: [{ summary: "開會", start: { dateTime: "..." }, ... }] }
```

### 實際應用
- **行事曆整合** — 同步會議、設定提醒
- **雲端硬碟管理** — 自動備份、檔案搜尋
- **YouTube 數據分析** — 頻道統計、觀眾分析
- **Gmail 自動化** — 郵件分類、自動回覆
- **表單/試算表** — 問卷收集、資料自動填入

---

## Discord

### 可用 API
[Discord Developer Docs](https://discord.com/developers/docs/reference)

### 預設 scope 能做的事
`identify` + `email`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `/users/@me` | GET |
| 取得使用者的伺服器列表 | `/users/@me/guilds` | GET（需 `guilds`） |

### 進階 scope

| Scope | 能做的事 | 應用場景 |
|-------|---------|---------|
| `guilds` | 取得使用者加入的伺服器 | 社群管理 |
| `guilds.join` | 把使用者加入伺服器 | 付費社群自動加入 |
| `guilds.members.read` | 讀取成員資料 | 會員驗證 |
| `bot` | Bot 操作 | Discord Bot |
| `connections` | 取得使用者的連結帳號 | 跨平台身份整合 |

### 範例：取得使用者加入的伺服器

```typescript
// 需要 scope: guilds
const guilds = await fetch("https://discord.com/api/v10/users/@me/guilds", {
  headers: { Authorization: `Bearer ${accessToken}` },
});
const data = await guilds.json();
// [{ id: "123", name: "My Server", icon: "abc", owner: true, ... }]
```

### 實際應用
- **社群身份驗證** — 確認使用者屬於特定伺服器
- **付費社群** — 付款後自動加入 Discord 伺服器
- **角色同步** — 網站會員等級同步到 Discord 角色
- **活動管理** — 基於 Discord 伺服器舉辦活動
- **遊戲整合** — 取得使用者的遊戲連結帳號

---

## X (Twitter)

### 可用 API
[X API v2](https://developer.x.com/en/docs/x-api)

### 預設 scope 能做的事
`users.read` + `tweet.read`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `/2/users/me` | GET |
| 取得使用者的推文 | `/2/users/:id/tweets` | GET |
| 取得使用者的時間線 | `/2/users/:id/timelines/reverse_chronological` | GET |

### 進階 scope

| Scope | 能做的事 | 應用場景 |
|-------|---------|---------|
| `tweet.write` | 發推文 | 社群管理工具 |
| `follows.read` | 讀取追蹤列表 | 社群分析 |
| `follows.write` | 追蹤/取消追蹤 | 自動化社群互動 |
| `like.read` / `like.write` | 讀取/按讚 | 內容策展 |
| `dm.read` / `dm.write` | 讀取/發送私訊 | 客服工具 |
| `space.read` | 讀取 Space 資訊 | 音頻內容管理 |

### 範例：取得使用者的最新推文

```typescript
// 需要 scope: users.read + tweet.read
const tweets = await fetch(
  "https://api.x.com/2/users/me/tweets?" +
  new URLSearchParams({
    max_results: "10",
    "tweet.fields": "created_at,public_metrics",
  }),
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
);
const data = await tweets.json();
// { data: [{ id: "123", text: "Hello!", public_metrics: { like_count: 5 } }] }
```

### 實際應用
- **社群管理工具** — 排程發文、分析互動
- **輿情分析** — 追蹤關鍵字和趨勢
- **客服系統** — 自動回覆 @ 提及
- **內容聚合** — 收集特定 hashtag 的推文

> ⚠️ Free tier 限制：每月 1,500 tweets POST、每月 10,000 tweets GET

---

## LINE

### 可用 API
[LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/) / [Social API](https://developers.line.biz/en/docs/social-api/)

### 預設 scope 能做的事
`openid` + `profile` + `email`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `api.line.me/v2/profile` | GET |
| 驗證 access token | `api.line.me/oauth2/v2.1/verify` | GET |

### 進階功能（需搭配 Messaging API）

| 功能 | 說明 | 應用場景 |
|------|------|---------|
| Push Message | 主動發訊息給使用者 | 通知、提醒 |
| Reply Message | 回覆使用者訊息 | 客服 Bot |
| Rich Menu | 自訂選單 | 互動式介面 |
| LINE Pay | 付款整合 | 電商 |
| LIFF | LINE 內嵌網頁 | 小程式 |

### 範例：發送推播訊息

```typescript
// 需要 Messaging API channel（跟 Login channel 不同）
const response = await fetch("https://api.line.me/v2/bot/message/push", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${channelAccessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: userId,
    messages: [{ type: "text", text: "你好！這是推播訊息。" }],
  }),
});
```

### 實際應用
- **LINE 官方帳號** — 商家客服、行銷推播
- **預約系統** — LINE 通知預約確認/提醒
- **LINE Pay 整合** — 行動支付結帳
- **LIFF 小程式** — LINE 內嵌互動頁面（問卷、遊戲）
- **群組 Bot** — 自動回覆、關鍵字觸發

> 📝 LINE Login 和 Messaging API 是不同的 Channel，但可以透過 user ID 串接

---

## Apple

### 可用 API
Apple 不提供額外的使用者 API。Sign In with Apple 主要用途是**身份驗證**。

### 預設 scope 能做的事
`name` + `email`

| 用途 | 說明 |
|------|------|
| 身份驗證 | 確認使用者身份（唯一 ID） |
| Email | 取得使用者 email（可能是 relay） |
| Name | 取得使用者名稱（僅首次） |

### 特色功能

| 功能 | 說明 |
|------|------|
| Private Email Relay | Apple 提供代理 email，保護使用者隱私 |
| App Transfer | 使用者 ID 在同一開發者帳號下的所有 App 間通用 |
| Real User Indicator | 反詐欺，指出使用者可信度 |

### 實際應用
- **iOS/macOS App 登入** — App Store 上架可能強制要求
- **隱私優先的服務** — 利用 Private Relay 保護使用者 email
- **跨 App 身份** — 同一開發者帳號下的多個 App 共用身份

> Apple 的設計哲學是「最小資料」，不像其他 provider 提供豐富的 API。適合只需要登入驗證的場景。

---

## Microsoft

### 可用 API
[Microsoft Graph API](https://learn.microsoft.com/en-us/graph/overview)

### 預設 scope 能做的事
`openid` + `profile` + `email` + `User.Read`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `graph.microsoft.com/v1.0/me` | GET |
| 取得大頭照 | `graph.microsoft.com/v1.0/me/photo/$value` | GET |

### 進階 scope（Microsoft Graph）

| Scope | 能做的事 | 應用場景 |
|-------|---------|---------|
| `Mail.Read` | 讀取 Outlook 郵件 | 郵件整合 |
| `Calendars.ReadWrite` | 讀寫行事曆 | 排程工具 |
| `Files.ReadWrite` | 讀寫 OneDrive | 雲端儲存 |
| `Team.ReadBasic.All` | 讀取 Teams 資訊 | 協作工具 |
| `Chat.ReadWrite` | 讀寫 Teams 聊天 | 客服整合 |
| `Sites.ReadWrite.All` | 讀寫 SharePoint | 文件管理 |

### 範例：讀取 Outlook 行事曆

```typescript
// 需要 scope: Calendars.Read
const events = await fetch(
  "https://graph.microsoft.com/v1.0/me/calendarView?" +
  new URLSearchParams({
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(Date.now() + 7 * 86400000).toISOString(),
  }),
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
);
const data = await events.json();
// { value: [{ subject: "Team Meeting", start: { dateTime: "..." } }] }
```

### 實際應用
- **企業單一登入 (SSO)** — 整合公司內部系統
- **Outlook 整合** — 郵件通知、行事曆同步
- **Teams Bot** — 企業內部自動化
- **OneDrive/SharePoint** — 文件管理系統
- **Power Automate 替代** — 自建自動化流程

> Microsoft Graph 是所有 provider 中 API 最豐富的，幾乎可以操作整個 Microsoft 365 套件。

---

## Twitch

### 可用 API
[Twitch API Reference](https://dev.twitch.tv/docs/api/reference/)

### 預設 scope 能做的事
`openid` + `user:read:email`

| 用途 | API | 方法 |
|------|-----|------|
| 取得使用者資料 | `api.twitch.tv/helix/users` | GET |
| 取得追蹤的頻道 | `api.twitch.tv/helix/channels/followed` | GET |

### 進階 scope

| Scope | 能做的事 | 應用場景 |
|-------|---------|---------|
| `channel:read:subscriptions` | 讀取訂閱者 | 訂閱管理 |
| `channel:manage:broadcast` | 管理直播設定 | 直播工具 |
| `chat:read` / `chat:edit` | 讀取/發送聊天 | 聊天 Bot |
| `clips:edit` | 建立精華片段 | 精華自動剪輯 |
| `moderation:read` | 讀取審核資料 | 審核工具 |
| `bits:read` | 讀取 Bits 資料 | 打賞統計 |
| `channel:read:redemptions` | 讀取獎勵兌換 | 互動系統 |

### 範例：取得頻道資訊

```typescript
const channel = await fetch(
  "https://api.twitch.tv/helix/channels?broadcaster_id=" + twitchUserId,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId,
    },
  }
);
const data = await channel.json();
// { data: [{ broadcaster_name: "xxx", game_name: "Just Chatting", title: "..." }] }
```

### 實際應用
- **直播面板 (Overlay)** — 顯示訂閱、Bits、追隨通知
- **聊天機器人** — 自動回覆、指令系統、抽獎
- **精華自動剪輯** — 偵測高峰時刻自動建立 Clip
- **數據儀表板** — 觀眾統計、成長追蹤
- **多平台聊天整合** — 統一顯示多個直播平台的聊天

> ⚠️ Twitch API 的所有請求都需要同時帶 `Authorization` 和 `Client-Id` header

---

## 跨 Provider 的應用模式

### 1. 多平台身份整合
讓使用者綁定多個帳號，建立統一身份。

```
使用者 → 用 Google 註冊
       → 之後綁定 Discord
       → 之後綁定 Twitch
       → 一個帳號，三個社群平台
```

### 2. 社群聚合
同時取得多個平台的資料，做統一分析。

- GitHub 貢獻 + X 互動 + Twitch 直播 → 開發者社群分析
- Google Calendar + Microsoft Calendar → 跨平台行事曆

### 3. 自動化工作流
利用各平台的 write scope 建立自動化。

- GitHub PR merged → X 發推 → Discord 通知
- Google Calendar 新事件 → LINE 推播提醒
- Twitch 開台 → Discord 公告 → X 發推

### 4. 會員制系統
結合 OAuth 身份和自有服務。

- Discord 特定角色 = 付費會員
- Twitch 訂閱者 = 網站 VIP
- GitHub Sponsors = 優先支援
