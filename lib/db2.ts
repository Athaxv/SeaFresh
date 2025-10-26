import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production'){
  globalThis.prisma = prisma
}

export default prisma

export async function connectDB(){
  try {
    await prisma.$connect()
    console.log('Connected to database')
  } catch (error) {
    console.error('Failed to connect to database', error)
    throw error
  }
}

export async function disconnectDB(){
  await prisma.$disconnect()
  console.log('Disconnected from database')
}