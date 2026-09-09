# Recognition & Rewards — Onboarding

Frontend luồng **onboarding B2B**: doanh nghiệp mới đăng ký và tạo workspace trên nền tảng Recognition & Rewards (mở rộng từ product nội bộ sang SaaS).

Tài liệu đầy đủ nằm trong [`docs/`](./docs/README.md).

## Stack

- Next.js 16 (App Router)
- React 19, TypeScript
- Tailwind CSS 4
- ESLint 9 + Prettier

## Getting started

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Mock API (MSW) **bật mặc định** cả `next dev` và production. Tắt: set `NEXT_PUBLIC_ENABLE_MSW=false` rồi build lại (xem `.env.example` và [docs/api.md](./docs/api.md)).

## Scripts

```bash
npm run dev           # dev server
npm run build         # production build
npm run start         # chạy bản build
npm run lint          # ESLint
npm run lint:fix      # ESLint --fix
npm run format        # Prettier write
npm run format:check  # Prettier check
```
