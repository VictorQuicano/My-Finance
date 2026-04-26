# References for Phase 1: Foundation

## Similar Implementations

No prior implementations exist in this codebase — this is a greenfield setup.

## External Documentation Consulted

### WorkOS AuthKit v4
- **Source:** `node_modules/@workos-inc/authkit-nextjs/README.md`
- **Key patterns:**
  - `authkitProxy()` for Next.js 16+ (`proxy.ts`)
  - `WORKOS_COOKIE_PASSWORD` required (32+ char session secret)
  - `NEXT_PUBLIC_WORKOS_REDIRECT_URI` env var name
  - `withAuth()` in server components; `useAuth()` hook in client components
  - `AuthKitProvider` wraps root layout
  - `handleAuth()` for OAuth callback route
  - `getSignInUrl()` / `getSignUpUrl()` for generating auth URLs

### Next.js 16.2.4
- **Source:** `node_modules/next/dist/docs/`
- **Key breaking changes:**
  - `middleware.ts` → `proxy.ts`
  - `cookies()`, `headers()`, `params`, `searchParams` are all async (must be awaited)
  - Turbopack is default bundler
