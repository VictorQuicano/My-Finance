# Standards for Phase 1: Foundation

The following standards apply to this work.

---

## backend/api-routes

All route handlers return this shape:

```ts
// Success
Response.json({ data: T }, { status: 200 | 201 })

// Error
Response.json({ error: { code: string, message: string } }, { status: 4xx | 5xx })
```

**Error Codes:** UNAUTHORIZED (401), FORBIDDEN (403), NOT_FOUND (404), VALIDATION_ERROR (422), INTERNAL_ERROR (500)

Use Zod `safeParse` for all request body validation. Route handlers only call `lib/` functions — no inline DB queries.

---

## backend/authentication

Package: `@workos-inc/authkit-nextjs`

`proxy.ts` is the single auth gate (Next.js 16+). Unauthenticated users on protected routes are redirected to WorkOS hosted login.

Session in server components: `const { user } = await withAuth()`

Onboarding redirect: check for `users` DB row in `app/(app)/layout.tsx`. Row missing → redirect to `/onboarding`.

User identity: `user.id` from WorkOS stored in `users.workos_user_id`. Always look up internal row by WorkOS ID. Use `getCurrentUser()` helper in `lib/auth.ts`.

---

## database/prisma

Client singleton in `lib/prisma.ts`. Never instantiate PrismaClient directly.

Schema conventions:
- Primary keys: `id @id @default(uuid())`
- All tables: `created_at DateTime @default(now())`
- Mutable tables: `updated_at DateTime @updatedAt`
- Soft deletes: `is_active Boolean @default(true)`
- Amounts: `Decimal` type (not Float)
- Months: `DateTime` with day always 1

---

## global/project-structure

No `src/` wrapper. Route groups: `(auth)` for public, `(app)` for protected. Feature components in `components/[feature]/`, shadcn primitives in `components/ui/`. All Prisma queries through `lib/prisma.ts`. Business logic in `lib/`, not in route handlers or components.
