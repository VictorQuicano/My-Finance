# Phase 1: Foundation — Shaping Notes

## Scope

Bootstrap the full foundation for MyWallet: dependency installation, environment setup, Prisma schema + migration for all 6 tables, WorkOS authentication (Next.js 16 proxy), and the 2-step onboarding flow (currency selection + allocation categories).

## Decisions

- `proxy.ts` used instead of `middleware.ts` (Next.js 16 breaking change)
- `authkitProxy()` used instead of `authkitMiddleware()` (WorkOS AuthKit v4 for Next.js 16+)
- Onboarding at `/onboarding` placed outside `(app)/` route group to avoid redirect loop
- Single atomic `POST /api/onboarding` creates user + categories + allocation_version in one transaction
- `WORKOS_COOKIE_PASSWORD` added as required env var (WorkOS v4 session encryption)
- Prisma 7.x + Zod 4.x — both installed (newer than standards were written against)
- `pnpm.onlyBuiltDependencies` added to package.json to allow Prisma engine builds

## Context

- **Visuals:** None
- **References:** No existing implementations in codebase (greenfield)
- **Product alignment:** Directly implements Phase 1 of roadmap.md

## Standards Applied

- `agent-os/standards/backend/api-routes.md` — response envelope, Zod validation, HTTP conventions
- `agent-os/standards/backend/authentication.md` — WorkOS setup, onboarding redirect pattern
- `agent-os/standards/database/prisma.md` — singleton, Decimal type, schema conventions
- `agent-os/standards/global/project-structure.md` — folder layout, route groups
