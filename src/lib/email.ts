import { Resend } from 'resend';
import { Alert } from '@/features/trading/types';
import AlertEmail from '@/emails/AlertEmail';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAlertEmail(
  userEmail: string,
  alert: Alert,
  currentPrice: number,
  change: number,
  changePercent: number
) {
  try {
    if (!resend) {
      console.warn('Resend not initialized, skipping email send');
      return;
    }

    const { data, error } = await resend.emails.send({
      from: 'Trading Alerts <alerts@yourdomain.com>',
      to: userEmail,
      subject: `Alert Triggered: ${alert.symbol} ${alert.condition} ${alert.value}`,
      react: AlertEmail({
        alert,
        currentPrice,
        change,
        changePercent,
      }),
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  if (!resend) {
    console.warn('Resend not initialized, skipping verification email');
    return;
  }

  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'noreply@votredomaine.com',
      to: email,
      subject: 'Vérification de votre email',
      html: `
        <h1>Vérification de votre email</h1>
        <p>Merci de vous être inscrit ! Pour vérifier votre email, cliquez sur le lien ci-dessous :</p>
        <a href="${confirmLink}">${confirmLink}</a>
        <p>Ce lien expirera dans 24 heures.</p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  if (!resend) {
    console.warn('Resend not initialized, skipping password reset email');
    return;
  }

  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: 'noreply@votredomaine.com',
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
  }
} 