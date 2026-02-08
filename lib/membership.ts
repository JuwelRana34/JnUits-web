import prisma from './prismadb'

export async function generateMembershipId() {
  const currentYear = new Date().getFullYear()
  const prefix = 'JnUITs'

  const memberCount = await prisma.user.count({
    where: {
      membershipId: {
        startsWith: `${prefix}-${currentYear}`,
      },
    },
  })

  const nextNumber = (memberCount + 1).toString().padStart(3, '0')

  return `${prefix}-${currentYear}${nextNumber}`
}
