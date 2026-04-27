import { withAuth } from '@workos-inc/authkit-nextjs'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const { user } = await withAuth()
  if (!user) return null
  return prisma.user.findUnique({ where: { workosUserId: user.id } })
}
