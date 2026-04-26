# Database & Prisma

## Client Singleton

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
```

- Always import `prisma` from `lib/prisma`, never instantiate directly

## Environment Split

| Env | Database | How |
|-----|----------|-----|
| Local dev | Docker Postgres container | `.env.local` sets `DATABASE_URL` |
| Production | Supabase Postgres | Vercel env var sets `DATABASE_URL` |

No code branching — only the env var changes.

## Migration Workflow

```bash
# Local: create + apply a new migration
pnpx prisma migrate dev --name <description>

# Production: apply pending migrations (CI/deploy step)
pnpx prisma migrate deploy
```

- Migration files are committed to git under `prisma/migrations/`
- Never use `prisma db push` in production

## Schema Conventions

- Primary keys: `id` as `@id @default(uuid())`
- All tables include `created_at DateTime @default(now())`
- Mutable tables include `updated_at DateTime @updatedAt`
- Soft deletes: `is_active Boolean @default(true)` (not physical deletes)
- Amounts: `Decimal` type (not `Float`) to avoid floating-point errors
- Months stored as `DateTime` with day always set to 1 (e.g. 2024-03-01)
