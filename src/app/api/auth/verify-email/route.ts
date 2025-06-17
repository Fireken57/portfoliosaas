import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token manquant' },
        { status: 400 }
      );
    }

    // Vérifier le token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: 'Token invalide' },
        { status: 400 }
      );
    }

    // Vérifier si le token a expiré
    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { message: 'Token expiré' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Supprimer le token utilisé
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json(
      { message: 'Email vérifié avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la vérification de l\'email' },
      { status: 500 }
    );
  }
} 