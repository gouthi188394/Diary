# Diary SaaS

Production-oriented diary SaaS with a React + Sass frontend, an Express + PostgreSQL backend, authentication, analytics, reminders, and test coverage.

## Apps

- `app/server`: Express API, PostgreSQL access, cron reminders, JWT auth, validation, tests
- `app/web`: React + Vite frontend, SCSS styling, charts, dashboard, diary editor, insights, tests

## Quick Start

1. Copy `app/server/.env.example` to `app/server/.env`
2. Copy `app/web/.env.example` to `app/web/.env` if your API URL is not the default
3. Create a PostgreSQL database and update `DATABASE_URL`
4. Install dependencies: `npm.cmd install`
5. Run migrations using your preferred Postgres client with `app/server/migrations/001_init.sql`
6. Start development: `npm.cmd run dev`

## Production Notes

- Set a strong `JWT_SECRET`
- Terminate TLS at your edge or platform
- Configure CORS with trusted origins only
- Attach a real notification provider for reminders if you want server-side delivery
- Deploy frontend and backend independently
