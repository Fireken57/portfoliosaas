import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testPrisma() {
  try {
    console.log('Testing Prisma connection...')

    // Test de création d'un utilisateur
    const newUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    console.log('User created:', newUser)

    // Test de récupération de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: newUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    console.log('User retrieved:', user)

    // Test de mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: {
        name: 'Updated Test User',
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    })

    console.log('User updated:', updatedUser)

    // Test de suppression de l'utilisateur
    await prisma.user.delete({
      where: { id: newUser.id },
    })

    console.log('User deleted successfully')

    console.log('All Prisma tests passed!')
  } catch (error) {
    console.error('Prisma test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPrisma() 