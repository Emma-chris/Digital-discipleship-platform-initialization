# DisciplePath Platform — Architecture Notes

This document describes how the monorepo is wired together, the contracts
between layers, and the security model. Read alongside `migrations/001_init.up.sql`.

## 1. Repo layout and module boundaries

```
shared/
  src/
    types/         api.ts (envelopes, CurrentUser, PaginationMeta),
                   entity.ts (rows shared with the client)
    constants/     roles.ts (RoleCode), errors.ts (ErrorCode),
                   status.ts (UserStatus, UserTokenKind, content types)
    validation/    zod schemas shared by server validation and client forms
    index.ts       re-exports the public API surface
```

`shared` is published as raw TypeScript (no build step): `main`/`types` point
at `src/index.ts`. The server bundles it through tsup; Vite consumes it
directly. There are **no** type-only features that require `tsc` project
references or a build order.

## 2. Runtime layering (server)

```
routes/*.routes.ts   → path wiring + authn/authz middleware + validators
controllers/*.ts     → HTTP concerns: parse validated input, call services, shape JSON
services/*.ts        → application logic, transactions, audit writes
repositories/*.ts    → parameterized SQL only
db/, auth/, middleware/, utils/ → infrastructure
```

- Controllers never run raw SQL; repositories never parse HTTP.
- Every DB access is through parameterized queries (`$1`, …). No interpolation
  of user input into SQL.
- `services/auth.service.ts` manages transactions with a pooled `PoolClient`,
  e.g. creating a user + profile + role assignment + verification token atomically.

## 3. Boot order and env loading

`config/env.ts` validates/`zod`s `process.env` **at module scope**, so the
`.env` file must be loaded before it is imported. Consequently:

- `index.ts` and `db/cli.ts` call `loadEnvFileFromRepo()` first, then
  `import()` the rest dynamically. Never import `config/env` (or modules that
  import it) at the top of an entry point.

`loadEnv.ts` walks up from `process.cwd()` to find the repo-root `.env` and
uses `process.loadEnvFile`.

## 4. Database

PostgreSQL, connected via a `pg.Pool`. Dev fallback `DATABASE_URL` points at
`localhost` (see `config/env.ts`) so a fresh checkout boots; every feature
that touches data requires a real connection.

Migration 001 creates 26 tables plus:

- `session` (connect-pg-simple backing store)
- `roles` seeded with `admin`, `instructor`, `mentor`, `student`
- `set_updated_at()` trigger updating `updated_at` on mutation
- Status/enum-like columns as `TEXT` + `CHECK` constraints (portable, no
  Postgres-only enum casts), UUID PKs from `gen_random_uuid()`
- `organization_id` nullable on core content tables — multi-org ready

Content hierarchy supported by the schema:
Organization → Pathway → Stage → Program → Course → Module → Lesson →
Activity → Assessment → enrollment/lesson/course/pathway progress.

### Migration runner (`db/migrate.ts`, `db/cli.ts`)

- Sorted by numeric prefix: `001_init.up.sql`.
- `schema_migrations` stores `version, name, checksum, applied_at`.
- `up`: applies any pending file inside a transaction; a checksum mismatch on
  an already-applied file aborts (protects deployed DBs from edited history).
- `down`: reverts the newest applied migration.
- `status`: lists applied vs pending with checksums.

## 5. API conventions

- Base path `/api`; JSON only.
- Success: `{ "success": true, "data": … }` (+ `meta` for pagination).
- Error: `{ "success": false, "code", "message", "details?" }`. `code` values
  come from `ErrorCode`.
- Pagination input is validated by `paginationSchema`; responses include
  `meta: { page, pageSize, total, totalPages }`.
- Express 5 propagates async rejections to the error middleware natively —
  handlers can `throw`/`await` without wrapper helpers.

## 6. AuthN / AuthZ

- **Session**: `express-session` + `connect-pg-simple` on the `session` table,
  httpOnly cookie `sid`, `SameSite=Lax`. Session middleware is lazily
  initialized with the shared pool (skipped for stateless health probes when a
  pool connection is unavailable).
- **JWT**: `signAccessToken` mints a short-lived token carrying
  `{ sub, org, roles }` for API/mobile consumers.
- **CSRF**: double-submit — a `csrfToken` cookie is set by middleware; web
  mutations send it back in `X-CSRF-Token`. Enforced only when a cookie-based
  session is present; bearer-only requests are exempt.
- `requireAuth` resolves the principal: session (loads roles from DB) or
  Bearer token (from signed claims). Roles are **always current from the DB**
  so role changes take effect immediately.
- `requireRole(RoleCode.ADMIN)` guards `/api/admin/*`; `users` routes return
  only self data (role-gated access to other users is a later phase).

## 7. Security checklist

- scrypt password hashing (`node:crypto`) with per-password random salt,
  timing-safe comparison; format `scrypt$N$r$p$salt$hash` (`auth/passwords.ts`).
- One-time tokens (verify-email, password reset) are hashed before storage via
  SHA-256 (`auth/tokens.ts`); history is sealed after use.
- `helmet` default security headers; `cors` credentials for `APP_URL`.
- `express-rate-limit` — global API limit + stricter auth-endpoint limits.
- pino logging with redaction of `password`, `token`, `secret`, `authorization`,
  `cookie` fields; health endpoint excluded from request logs.
- Rate-limit headers and CSRF cookie were verified on the running server
  (see final validation notes).

## 8. Client architecture

- Routes (`routes/index.tsx`): `PublicLayout` (marketing/auth pages),
  `ProtectedRoute` → `DashboardLayout` (learner pages), nested
  `AdminRoute` → admin pages. Lazy-loaded via React Router `lazy`.
- `services/api.ts`: fetch wrapper — `credentials: include`, attaches
  `X-CSRF-Token` from the cookie when present, supports Bearer tokens, throws
  `ApiClientError` on error envelopes.
- `services/services.ts`: typed `authService` and `contentService` facades.
- `hooks/useAuth.ts`: TanStack Query caching of `/auth/me` with `useAuth` /
  `useSetAuth` / `useLogout` around login/register/logout.
- Design system: Tailwind v4 `@theme` tokens (`brand`, `navy`, fonts, radius,
  shadows) in `index.css`; all components under `components/ui` are in-house.
- All pages render real empty states (no mock content) and share
  `EmptyState`/`PageLoader`/`Alert` components.

## 9. Known / accepted limitations (foundation phase)

- List endpoints return real published data; learning writes, enrollment
  creation, assessments/grading, certificates, mentorship and community are
  intentionally staged (endpoints exist and return 501 where appropriate).
- `/api/community/*` and `/api/admin/*` are authorization-gated 501 stubs.
- `npm audit` reports low/moderate dev-only advisories (vitest, tsup/esbuild)
  with no non-breaking fix; they are not part of the production bundle.