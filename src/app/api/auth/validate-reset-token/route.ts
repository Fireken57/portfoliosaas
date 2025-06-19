import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { message: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Token manquant' },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      { message: 'Token valide' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la validation du token' },
      { status: 500 }
    );
  }
} 