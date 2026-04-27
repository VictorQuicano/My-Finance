import { z } from 'zod'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { prisma } from '@/lib/prisma'

const OnboardingSchema = z.object({
  homeCurrency: z.string().length(3),
  categories: z
    .array(
      z.object({
        name: z.string().min(1),
        percentage: z.number().min(0).max(100),
        isSavings: z.boolean().default(false),
        isMixed: z.boolean().default(false),
      })
    )
    .min(1),
})

export async function POST(req: Request) {
  const { user } = await withAuth()
  if (!user) {
    return Response.json({ error: { code: 'UNAUTHORIZED', message: 'Not signed in' } }, { status: 401 })
  }

  const existing = await prisma.user.findUnique({ where: { workosUserId: user.id } })
  if (existing) {
    return Response.json({ error: { code: 'FORBIDDEN', message: 'Already onboarded' } }, { status: 403 })
  }

  const body = await req.json()
  const parsed = OnboardingSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: parsed.error.message } },
      { status: 422 }
    )
  }

  const { homeCurrency, categories } = parsed.data
  const total = categories.reduce((sum, c) => sum + c.percentage, 0)
  if (total > 100) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Total percentage cannot exceed 100' } },
      { status: 422 }
    )
  }

  const dbUser = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { workosUserId: user.id, homeCurrency },
    })

    const createdCategories = await Promise.all(
      categories.map((cat) =>
        tx.expenseCategory.create({
          data: {
            userId: newUser.id,
            name: cat.name,
            isSavings: cat.isSavings,
            isMixed: cat.isMixed,
          },
        })
      )
    )

    const version = await tx.allocationVersion.create({
      data: {
        userId: newUser.id,
        effectiveFrom: new Date(new Date().toISOString().split('T')[0]),
      },
    })

    await Promise.all(
      categories.map((cat, i) =>
        tx.allocationEntry.create({
          data: {
            versionId: version.id,
            categoryId: createdCategories[i].id,
            percentage: cat.percentage,
          },
        })
      )
    )

    return newUser
  })

  return Response.json({ data: { userId: dbUser.id } }, { status: 201 })
}
