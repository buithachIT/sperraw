# API

Chưa có backend. Frontend gọi `fetch` cùng origin; **MSW** chặn trong browser (`src/mocks/`). Không có Next.js `src/app/api/**/route.ts`.

Mock **bật mặc định** (kể cả production trên Vercel). Tắt bằng env lúc **build**:

```bash
NEXT_PUBLIC_ENABLE_MSW=false
```

`NEXT_PUBLIC_ENABLE_MSW=true` hoặc không set → bật. Flag phải là `NEXT_PUBLIC_` vì worker chạy trên client; đổi env trên Vercel rồi **redeploy**. `msw` nằm trong `dependencies` để production bundle có worker. File worker: `/mockServiceWorker.js`.

Delay mỗi handler **~400ms**. Session mock là `currentSession` in-memory; khi reload tab, `MswProvider` hydrate Zustand rồi `restoreSession` / `restoreWorkspace`.

Lỗi JSON: `{ "message": string }`. Client ném `ApiError` (`status` + `message`) — `src/lib/api/http.ts`.

Không dùng cookie/JWT. “Đã login” = có `currentSession` (khôi phục từ `sessionStorage` `sperraw-auth`).

## Auth

### `POST /api/auth/register`

Tạo admin account và set session.

**Client:** `registerAccount()` — `src/lib/api/auth.ts`  
**Gọi từ:** `RegisterForm`

**Body**

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

| Field | Rule phía mock |
| --- | --- |
| `fullName` | trim, 2–80 ký tự |
| `email` | format email, lowercase |
| `password` | ≥ 8, có chữ và số |

**Responses**

| Status | Body | Khi nào |
| --- | --- | --- |
| `201` | `{ "user": { "id", "fullName", "email" } }` | OK — set `currentSession`. Không trả password |
| `400` | `{ "message": "Invalid account payload" }` | Tên/email không hợp lệ |
| `400` | `{ "message": "Password must be at least 8 characters and include a letter and a number" }` | Password yếu |
| `409` | `{ "message": "This email is already registered" }` | Email đã có, hoặc reserved |

Email reserved: `nasbui.r@example.net`, `demo@sperraw.app` (`src/consts/auth.ts`).

---

### `POST /api/auth/logout`

Xoá mock session. Persist client (`clearAccount` + `reset` onboarding) do UI làm sau khi gọi API.

**Client:** `logoutAccount()`  
**Gọi từ:** `AppHeader`

**Body:** không

| Status | Body |
| --- | --- |
| `200` | `{ "ok": true }` |

---

## Onboarding / workspace

### `GET /api/onboarding/slug?value=`

Check slug còn trống. Không cần session.

**Client:** `checkSlugAvailability(value)` → `boolean`  
**Gọi từ:** `StepCompany` (debounce 400ms)

**Query:** `value` — slug đã trim

| Status | Body | Ghi chú |
| --- | --- | --- |
| `200` | `{ "available": true }` | Chưa dùng |
| `200` | `{ "available": false }` | Trống / `< 3` ký tự / sai pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$` / reserved / đã có |

Slug reserved: `demo`, `admin`, `www`.

UI coi slug của workspace hiện tại là available (tránh false positive khi quay lại bước Add Workspace).

---

### `POST /api/onboarding/workspace`

Tạo workspace gắn owner = session hiện tại. Một account một workspace.

**Client:** `createWorkspace({ name, slug })`  
**Gọi từ:** `StepCompany` (bỏ qua nếu `workspaceId` đã có)

**Auth:** cần `currentSession` → không có thì `401`

**Body**

```json
{
  "name": "string",
  "slug": "string"
}
```

| Field | Rule phía mock |
| --- | --- |
| `name` | trim, tối thiểu 2 ký tự |
| `slug` | lowercase, pattern như trên, tối thiểu 3 ký tự |

**Responses**

| Status | Body | Khi nào |
| --- | --- | --- |
| `201` | `{ "workspace": { "id", "ownerId", "name", "slug" } }` | Tạo xong |
| `401` | `{ "message": "Not authenticated" }` | Chưa login |
| `400` | `{ "message": "Invalid workspace payload" }` | name/slug không hợp lệ |
| `409` | `{ "message": "You already have a workspace" }` | Owner đã có workspace |
| `409` | `{ "message": "Slug này đã được dùng" }` | Slug trùng hoặc reserved |

Client type `Workspace` chỉ lấy `id`, `name`, `slug` (bỏ `ownerId`).

---

### `GET /api/onboarding/workspace`

Workspace của session hiện tại.

**Client:** `getWorkspace()` → `Workspace \| null` (`404` → `null`)  
**Gọi từ:** `HomePage` khi có account nhưng chưa có workspace trong store

**Auth:** cần session

| Status | Body | Khi nào |
| --- | --- | --- |
| `200` | `{ "workspace": { "id", "ownerId", "name", "slug" } }` | Có workspace |
| `401` | `{ "message": "Not authenticated" }` | Chưa login |
| `404` | `{ "message": "Workspace not found" }` | Login rồi nhưng chưa tạo |

---

## Không có API

Các bước sau **chỉ lưu Zustand** (`sperraw-onboarding`), không gọi server:

- Email forwarding (confirm checkbox)
- Invite teammates (`parseInviteEmails`)

## File

| Việc | Path |
| --- | --- |
| Auth fetch | `src/lib/api/auth.ts` |
| Workspace / slug fetch | `src/lib/api/onboarding.ts` |
| `ApiError` | `src/lib/api/http.ts` |
| MSW auth | `src/mocks/auth-handlers.ts`, `src/mocks/auth-db.ts` |
| MSW workspace | `src/mocks/handlers.ts`, `src/mocks/onboarding-db.ts` |
| Start worker | `src/mocks/browser.ts`, `src/mocks/MswProvider.tsx` |
| Flag bật/tắt | `src/consts/msw.ts` (`NEXT_PUBLIC_ENABLE_MSW`) |

Luồng UI: [onboarding-flow.md](./onboarding-flow.md). Kiến trúc app: [frontend.md](./frontend.md).
