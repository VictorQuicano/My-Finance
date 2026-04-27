import { redirect } from 'next/navigation'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { prisma } from '@/lib/prisma'
import { SideNav } from '@/components/ui/sidenav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await withAuth({ ensureSignedIn: true })

  const dbUser = await prisma.user.findUnique({
    where: { workosUserId: user.id },
    select: { id: true },
  })

  if (!dbUser) redirect('/onboarding')

  return (
    <>
      <SideNav />
      <div className="ml-64 bg-[#F5F0EB] min-h-screen flex flex-col">
        {children}
      </div>
    </>
  )
}
