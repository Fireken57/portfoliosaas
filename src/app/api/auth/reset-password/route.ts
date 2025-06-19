import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    if (!prisma) {
      return NextResponse.json(
        { message: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours un succès
      return NextResponse.json(
        { message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' },
        { status: 200 }
      );
    }

    // Générer un token de réinitialisation
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email seulement si Resend est configuré
    if (resend) {
      const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`;
      
      await resend.emails.send({
        from: 'noreply@votredomaine.com',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <h1>Réinitialisation de mot de passe</h1>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
        `,
      });
    }

    return NextResponse.json(
      { message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
} 