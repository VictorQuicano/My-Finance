# Project Structure

## Root Layout

```
my-wallet/
├── app/                ← Next.js App Router
│   ├── (auth)/         ← auth route group (login, callback)
│   ├── (app)/          ← protected route group
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── onboarding/
│   │   └── settings/
│   ├── api/            ← Route Handlers
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── categories/
│   │   ├── allocations/
│   │   ├── exchange-rates/
│   │   └── dashboard/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/             ← shadcn primitives, shared atoms
│   ├── dashboard/
│   ├── income/
│   ├── expenses/
│   └── settings/
├── lib/
│   ├── prisma.ts       ← singleton Prisma client
│   ├── auth.ts         ← WorkOS session helpers
│   ├── currency.ts     ← conversion utilities
│   └── utils.ts        ← general helpers
├── types/
│   └── index.ts        ← shared TS interfaces
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── documentation/
└── middleware.ts       ← route auth guard
```

## Rules

- No `src/` wrapper
- Route groups: `(auth)` for public, `(app)` for protected
- Feature components live in `components/[feature]/`
- Shared primitives (shadcn) live in `components/ui/`
- All Prisma queries go through `lib/prisma.ts` singleton
- Business logic lives in `lib/`, not in route handlers or components
- `middleware.ts` is the single place for auth guard — do not duplicate checks in route handlers
