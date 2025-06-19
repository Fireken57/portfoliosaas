import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import bcrypt from 'bcryptjs'

// GET /api/users - Récupérer tous les utilisateurs
export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
      cacheStrategy: { ttl: 60 },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Erreur GET:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

// POST /api/users - Créer un nouvel utilisateur
export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    const body = await request.json()
    console.log('Données reçues:', body)
    const { name, email, password } = body

    // Validation des données
    if (!email || !password) {
      console.log('Données manquantes:', { email, password })
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('Utilisateur existant trouvé:', existingUser)
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Tentative de création d\'utilisateur...')
    // Créer le nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
    console.log('Utilisateur créé avec succès:', user)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Erreur détaillée:', error)
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de l\'utilisateur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
} 