import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { message: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier le token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hash(password, 12);

    // Mettre à jour le mot de passe et effacer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: 'Mot de passe mis à jour avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du mot de passe' },
      { status: 500 }
    );
  }
} 