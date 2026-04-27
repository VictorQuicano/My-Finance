import Link from 'next/link'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { user } = await withAuth()
  if (user) redirect('/dashboard')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">MyWallet</h1>
        <p className="mt-3 text-lg text-zinc-500">Your personal finance dashboard</p>
      </div>
      <Link
        href="/sign-in"
        className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
      >
        Sign in
      </Link>
    </main>
  )
}
