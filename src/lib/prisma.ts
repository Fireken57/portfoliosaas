import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  // Only initialize if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, Prisma client will not be initialized');
    return null;
  }
  
  try {
    return new PrismaClient().$extends(withAccelerate())
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    return null;
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
} 

export { prisma }
export default prisma 