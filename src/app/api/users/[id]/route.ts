import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/[id] - Récupérer un utilisateur spécifique
export async function GET(request: Request, context: any) {
  const id = context?.params?.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
      cacheStrategy: { ttl: 60 },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[id] - Mettre à jour un utilisateur
export async function PATCH(request: Request, context: any) {
  const id = context?.params?.id;
  try {
    const body = await request.json()
    const { name, email } = body

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Supprimer un utilisateur
export async function DELETE(request: Request, context: any) {
  const id = context?.params?.id;
  try {
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Utilisateur supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    )
  }
} 