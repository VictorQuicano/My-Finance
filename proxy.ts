import { authkitProxy } from '@workos-inc/authkit-nextjs'

export default authkitProxy({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/sign-in', '/api/auth/(.*)'],
  },
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
