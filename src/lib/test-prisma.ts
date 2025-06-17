import { prisma } from './prisma'

async function testPrismaOperations() {
  try {
    console.log('🚀 Démarrage des tests Prisma avec Accelerate...')

    // Générer un email unique
    const uniqueEmail = `test${Date.now()}@example.com`
    console.log('📧 Email de test:', uniqueEmail)

    // 1. CREATE - Créer un utilisateur
    console.log('📝 Création d\'un nouvel utilisateur...')
    const newUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: uniqueEmail,
        password: "hashedPassword123", // Dans une vraie app, il faudrait hasher le mot de passe
      },
    })
    console.log('✅ Utilisateur créé:', newUser)

    // 2. READ - Lire les données avec cache
    console.log('🔍 Lecture de l\'utilisateur avec cache...')
    const user = await prisma.user.findUnique({
      where: {
        email: uniqueEmail,
      },
      cacheStrategy: { ttl: 60 }, // Cache pour 60 secondes
    })
    console.log('✅ Utilisateur trouvé (avec cache):', user)

    // Lire tous les utilisateurs avec cache
    console.log('📚 Lecture de tous les utilisateurs avec cache...')
    const allUsers = await prisma.user.findMany({
      cacheStrategy: { ttl: 60 },
    })
    console.log('✅ Nombre total d\'utilisateurs:', allUsers.length)
    console.log('📋 Liste des utilisateurs:', allUsers)

    // 3. UPDATE - Mettre à jour un utilisateur
    console.log('🔄 Mise à jour de l\'utilisateur...')
    const updatedUser = await prisma.user.update({
      where: {
        email: uniqueEmail,
      },
      data: {
        name: "Test User Updated",
      },
    })
    console.log('✅ Utilisateur mis à jour:', updatedUser)

    // 4. DELETE - Supprimer un utilisateur
    console.log('🗑️ Suppression de l\'utilisateur...')
    const deletedUser = await prisma.user.delete({
      where: {
        email: uniqueEmail,
      },
    })
    console.log('✅ Utilisateur supprimé:', deletedUser)

    console.log('✨ Tests terminés avec succès!')

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
    console.log('👋 Connexion à la base de données fermée')
  }
}

// Exécuter les tests
testPrismaOperations() 