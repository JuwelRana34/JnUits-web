import prisma from './prismadb'

export async function generateMembershipId(index: string) {
  const currentYear = new Date().getFullYear()
  const prefix = 'JnUITS'

  const memberCount = await prisma.user.count({
    where: {
      membershipId: {
        startsWith: `${prefix}-${currentYear}${index}`,
      },
    },
  })

  const nextNumber = (memberCount + 1).toString().padStart(3, '0')

  return `${prefix}-${currentYear}${nextNumber}`
}
