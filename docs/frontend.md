# Frontend

App **Next.js (App Router) + TypeScript + Tailwind**. Chưa có backend; register và workspace chạy trên **MSW** trong browser. Không dùng Next.js `route.ts` để mock.

Luồng user: [onboarding-flow.md](./onboarding-flow.md). Bối cảnh sản phẩm: [product-context.md](./product-context.md).

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- React Hook Form + Zod
- Zustand (auth + wizard persist `sessionStorage`)
- MSW 2 (mock `fetch` trên browser)
- shadcn/ui primitives (button, input, checkbox, sonner)

MSW worker start trong `MswProvider` (đợi worker + hydrate session rồi mới render). `instrumentation-client.ts` start sớm để tránh `configure()` kép. Delay handler ~400ms.

## Cấu trúc

```
src/
  app/
    layout.tsx                 # AuthGuard + footer + toaster
    page.tsx                   # homepage (landing hoặc workspace)
    register/page.tsx
    onboarding/page.tsx
  consts/                      # ROUTES, AUTH_REQUIRED, GUEST_ONLY, steps
  features/
    auth/                      # register, header, AuthGuard, auth store
    onboarding/                # wizard, steps, onboarding store
    home/                      # landing + WorkspaceHome
  lib/api/                     # fetch wrappers: auth, onboarding, http
  mocks/                       # MSW handlers + in-memory db
```

`src/app` chỉ wiring route. Logic nằm trong `features/`.

## Routing

| Path | Việc |
| --- | --- |
| `/` | Landing nếu chưa có workspace; workspace home nếu đã tạo |
| `/register` | Guest-only: form admin |
| `/onboarding` | Auth-required: wizard |

Không có `/w/[slug]`. Workspace home dùng `/`.

`AuthGuard` trong root layout đọc pathname + `account` + `workspaceId`. Chi tiết bảng redirect: [onboarding-flow.md](./onboarding-flow.md#guard).

## Hai store — đừng gộp

| Store | Giữ gì |
| --- | --- |
| `useAuthStore` | `account`, `workspace` — persist `sessionStorage` (`sperraw-auth`) |
| `useOnboardingStore` | `stepIndex`, workspace fields, forwarding, invites — persist `sessionStorage` (`sperraw-onboarding`) |

Account **không** nằm trong onboarding store. Logout `clearAccount` + `reset()` onboarding, xoá session.

Không persist unsaved-changes dialog. Refresh tab **giữ login, workspace, và data wizard**; đóng tab thì hết session.

Khi hydrate, mock MSW `currentSession` và workspace db được restore từ session để API (logout, GET workspace) vẫn chạy.

Stepper: `goTo(index)` chỉ cho `index <= stepIndex`.

## Mock API (MSW)

Contract đầy đủ (path, body, status, caller): [api.md](./api.md).

In-memory, module scope. Restart `npm run dev` reset mock db. Refresh tab: Zustand persist khôi phục account/workspace, rồi restore mock session. Logout xoá persist + `currentSession`. Client wrappers: `src/lib/api/auth.ts`, `src/lib/api/onboarding.ts`.

## Slug

Từ tên workspace → `slugify` (`src/lib/slugify.ts`):

- NFD, bỏ dấu
- lowercase
- ký tự không `[a-z0-9]` → `-`
- trim `-`, cắt 32

Client check format bằng Zod; uniqueness qua `GET slug` (debounce 400ms) và lại lúc `POST workspace`.

## Homepage sau khi tạo workspace

`HomePage` đọc auth store (đã hydrate):

1. Có `account` và `workspace` → `WorkspaceHome`
2. Có `account`, chưa workspace → landing *Continue setup* (có thể `GET /api/onboarding/workspace`)
3. Chưa login → landing *Create workspace*

## Nguyên tắc UI

- Copy tiếng Anh; docs tiếng Việt
- Lỗi gắn field, toast cho success (register, tạo workspace, logout)
- Header dùng chung trên register, wizard, workspace home
- Token màu trong `src/app/globals.css`

## Tiêu chí luồng register + workspace

- [ ] Landing → register → onboarding → tạo workspace → forwarding → invite (hoặc trống) → home
- [ ] Email trùng / reserved hiện lỗi trên email
- [ ] Slug reserved / trùng bị chặn (debounce + submit)
- [ ] Chưa login không vào `/onboarding`
- [ ] Đã login không vào `/register`
- [ ] Homepage hiện workspace sau khi tạo; logout về landing
- [ ] `npm run lint` và `npm run format:check` pass
