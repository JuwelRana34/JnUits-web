// import { PrismaClient } from '@prisma/client'
// declare global {
//   var prisma: PrismaClient | undefined
// }
// const prisma = global.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== 'production') {
//   global.prisma = prisma
// }
// export default prisma
import { PrismaClient } from '@prisma/client'

// Global type definition for Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Singleton pattern to prevent multiple instances in development
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
