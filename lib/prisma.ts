let prisma: any

try {
  // Try to load the actual Prisma Client if installed
  const { PrismaClient } = require('@prisma/client')
  const globalForPrisma = global as unknown as { prisma?: typeof PrismaClient }
  prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (err) {
  // Fallback to a lightweight mock implementation
  const { MockPrisma } = require('./mockPrisma')
  prisma = new MockPrisma()
}

export { prisma }
