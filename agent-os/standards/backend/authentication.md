# Authentication (WorkOS AuthKit)

## Package

`@workos-inc/authkit-nextjs`

## Middleware Guard

```ts
// middleware.ts
import { authkitMiddleware } from '@workos-inc/authkit-nextjs'

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/api/auth/(.*)'],
  },
})

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] }
```

- `middleware.ts` is the single auth gate — never add auth checks inside route handlers
- Unauthenticated users hitting protected routes are redirected to WorkOS hosted login

## Session in Server Components & Route Handlers

```ts
import { withAuth } from '@workos-inc/authkit-nextjs'

// Server Component
const { user } = await withAuth()

// Route Handler
export async function GET(req: Request) {
  const { user } = await withAuth()
  // user.id is the WorkOS user ID
}
```

## Onboarding Redirect

After sign-in, check if a `users` DB row exists for the WorkOS user ID:
- Row exists → continue to `/dashboard`
- Row missing → redirect to `/onboarding`

This check lives in `app/(app)/layout.tsx`, not in middleware.

## User Identity

- `user.id` from WorkOS is stored in `users.workos_user_id`
- Always look up the internal `users` row by `workos_user_id` before any DB operation
- Keep a `getCurrentUser()` helper in `lib/auth.ts` that returns the full DB user
