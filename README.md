# DisciplePath Platform

A production-oriented digital discipleship and Christian education platform
("DisciplePath"). Monorepo with a React web client, an Express REST API, a
PostgreSQL schema, and shared contracts.

Foundation phase: authentication, authorization, content catalog APIs,
migrations, the complete routing skeleton (public + dashboard + admin), and
an in-house Tailwind design system are implemented. Content workflows,
learning/progress write operations, mentorship and community modules are
staged in later phases — the API surface and routes exist as real endpoints.

## Stack

- **Client**: React 19, Vite 7, Tailwind CSS v4, React Router 7, TanStack Query, react-hook-form + zod
- **API**: Express 5 (TypeScript, ESM), `pg` (node-postgres)
- **Database**: PostgreSQL (Neon/serverless ready), plain SQL migrations
- **Auth**: Server-side Postgres-backed sessions + short-lived JWTs for API/mobile clients; scrypt password hashing (built-in `node:crypto`); double-submit CSRF protection
- **Tooling**: npm workspaces, tsup (server bundle), Vitest, ESLint (typescript-eslint)

## Structure

```
├── shared/     Zod schemas, shared types, constants (raw TS, consumed by server & client)
├── server/     Express API, auth, repositories, migrations runner
├── client/     React SPA
├── migrations/ versioned SQL migrations (up/down pairs)
└── docs/       architecture notes
```

## Prerequisites

- Node.js >= 20.11 (uses `process.loadEnvFile` and `import.meta.dirname`), npm 10+
- A PostgreSQL database (e.g. [Neon](https://neon.tech)) — export the connection string

## Quick start

```bash
npm install

# 1. Environment — copy .env.example to .env and fill in DATABASE_URL,
#    SESSION_SECRET, JWT_SECRET. Development will boot without .env using
#    explicit dev-only fallbacks (never in production).
cp .env.example .env

# 2. Apply database migrations
npm run db:migrate        # cwd server: tsx src/db/cli.ts up
npm run db:status         # show applied migrations

# 3. Run server + client together (concurrently)
npm run dev               # API :3000, web :5173
```

Open http://localhost:5173. API health check: http://localhost:3000/api/health.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run API and web dev servers concurrently |
| `npm run build` | Build server (tsup) then client (vite) |
| `npm run typecheck` | `tsc --noEmit` in shared, server, client |
| `npm run lint` | ESLint over the whole repo |
| `npm test` | Vitest (shared validation, server password hashing) |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:migrate:down` | Revert the most recent applied migration |
| `npm run db:status` | List applied/pending migrations with checksums |

## Environment variables

See `.env.example`. Required for production:

- `DATABASE_URL` — `postgres://` connection string
- `SESSION_SECRET` — >= 32 chars, signs session cookie
- `JWT_SECRET` — >= 32 chars, signs short-lived access tokens

Optional: `APP_URL` (default `http://localhost:5173`), `API_URL`
(`http://localhost:3000`), `PORT` (3000), `NODE_ENV`
(development|test|production), `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`,
`RATE_LIMIT_AUTH_MAX`.

> `NODE_ENV=production` refuses to start with missing or placeholder secrets;
> dev-only fallbacks are applied otherwise.

## Migrations

Plain SQL in `migrations/NNN_name.up.sql` / `.down.sql`. The runner tracks
applied files in `schema_migrations(version, name, checksum, applied_at)` and
blocks `up` if the on-disk file no longer matches the recorded checksum.
`down` reverts the last applied migration using its `.down.sql`.

## Auth overview

- Registration seeds your account with the `student` role (admin/instructor/
  mentor roles are seeded by migration 001).
- Login sets an httpOnly `sid` session cookie backed by the `session` table
  and returns an `accessToken` JWT for API/mobile consumers.
- Web requests carry the cookie + `X-CSRF-Token` header (double-submit);
  bearer-only requests skip CSRF.
- The server re-fetches the user's current roles per request — role changes
  apply immediately.

## Quality gates

Before shipping, run the full pipeline:

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## Roadmap (later phases)

- Admin CRUD for users, content, mentorship assignments
- Enrollment, study/progress tracking, assessments & certificates
- Mentorship matching and community hub
- Email delivery for verification & password reset (currently tokens are returned in the API response in development)