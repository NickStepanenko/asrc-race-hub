ASRC Race Hub
=============

A Next.js 15 web app served through an Express gateway. Prisma powers Postgres persistence, and Redis (with Memorai installed) is used for fast caching/session-style work. The custom server starts both the API routes and Next.js frontend together.

## Requirements

- Node.js 18+ and npm
- Postgres database
- Prisma schema generated
- Redis server with Memorai installed
- Environment variables configured (see `.env` / `.env.prod`): `DATABASE_URL`, `SHADOW_DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`, `WEB_ORIGIN`, SMTP settings, etc.

## Setup

1) Install deps: `npm install`
2) Configure env: copy `.env` or `.env.prod` and update secrets/URLs for your Postgres + Redis instances
3) Prepare Postgres: create the target databases and run Prisma migrations `npx prisma db push` and `npx prisma generate`
4) Start Redis with Memorai

## Running the app

- Development: `npm run dev` (Express + Next.js together, defaults to port 3000)
- Production: `npm run build` then `npm run start` (requires `node_modules`; sets `NODE_ENV=production`)

## Quality checks

- Tests: `npm run vitest` (watch: `npm run test:watch`, coverage: `npm run coverage`, UI: `npm run test:ui`)
- Lint: `npm run lint`

## Notes

- The server entrypoint is `server/index.ts`; Next.js pages live under `app/`
- CORS origin is controlled by `WEB_ORIGIN`; keep it aligned with your frontend host
