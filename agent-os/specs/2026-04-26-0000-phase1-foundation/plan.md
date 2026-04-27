# Phase 1: Foundation — Implementation Plan

## Tasks

### Task 1: Save Spec Documentation ✅
Created `agent-os/specs/2026-04-26-0000-phase1-foundation/` with plan.md, shape.md, standards.md, references.md.

### Task 2: Install Dependencies ✅
- `@workos-inc/authkit-nextjs@4.0.1`
- `@prisma/client@7.8.0`, `prisma@7.8.0` (dev)
- `@prisma/adapter-pg@7.8.0`, `pg@8.20.0` (Prisma 7 requires adapter for direct connection)
- `zod@4.3.6`
- `dotenv-cli` (dev, for db:migrate script)

### Task 3: Environment Files ✅
- `.env.local` — DATABASE_URL + WorkOS keys (gitignored)
- `.env` — DATABASE_URL only, for Prisma CLI (gitignored)
- `.env.example` — committed placeholder

### Task 4: Project Structure ✅
```
app/(auth)/page.tsx        ← landing page
app/(app)/layout.tsx       ← auth guard + onboarding redirect
app/(app)/dashboard/page.tsx ← stub
app/onboarding/page.tsx    ← 2-step form (outside (app) to avoid redirect loop)
app/api/auth/callback/route.ts
app/api/onboarding/route.ts
components/ui/, onboarding/
lib/prisma.ts, lib/auth.ts
types/index.ts
prisma/schema.prisma
proxy.ts                   ← Next.js 16 auth proxy
prisma.config.ts           ← Prisma 7 datasource config
```

### Task 5: Prisma Schema + Migration ✅
All 6 tables created and migrated: users, expense_categories, allocation_versions, allocation_entries, income_entries, expenses, exchange_rates.

Prisma 7 notes:
- `url` removed from datasource in schema.prisma → moved to `prisma.config.ts`
- PrismaClient uses `@prisma/adapter-pg` (PrismaPg) for direct connection
- Run migrations: `pnpm db:migrate` (uses dotenv-cli to load .env.local)

### Task 6: WorkOS Auth ✅
- `proxy.ts` with `authkitProxy()` (Next.js 16+, WorkOS AuthKit v4)
- `app/api/auth/callback/route.ts` with `handleAuth({ returnPathname: '/dashboard' })`
- `lib/auth.ts` with `getCurrentUser()` helper
- `AuthKitProvider` wraps root layout

### Task 7: App Layout with Onboarding Redirect ✅
- `app/(app)/layout.tsx` — checks DB for user row, redirects to /onboarding if missing
- `app/(auth)/page.tsx` — landing page with sign-in link from `getSignInUrl()`

### Task 8: Onboarding Flow ✅
- `app/onboarding/page.tsx` — 2-step client component (currency → categories)
- `app/api/onboarding/route.ts` — atomic POST: creates user + categories + allocation_version in `prisma.$transaction`

## Verification
1. Fill in WORKOS_CLIENT_ID, WORKOS_API_KEY in `.env.local`
2. `pnpm dev` — app starts on localhost:3000
3. Visit `/` → landing page with sign-in button
4. Sign in → redirected to `/onboarding` (no DB user yet)
5. Complete onboarding → redirected to `/dashboard`
6. Re-sign-in → goes directly to `/dashboard`
7. `pnpm db:migrate` for future schema changes
