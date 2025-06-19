import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, context: any) {
  const id = context?.params?.id;
  try {
    if (!prisma) {
      return new NextResponse('Service temporairement indisponible', { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alert = await prisma.alert.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!alert) {
      return new NextResponse('Alert not found', { status: 404 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: any) {
  const id = context?.params?.id;
  try {
    if (!prisma) {
      return new NextResponse('Service temporairement indisponible', { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, symbol, condition, value, triggered, message } = body;

    const alert = await prisma.alert.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!alert) {
      return new NextResponse('Alert not found', { status: 404 });
    }

    const updatedAlert = await prisma.alert.update({
      where: {
        id,
      },
      data: {
        type,
        symbol,
        condition,
        value,
        triggered,
        message,
        updatedAt: new Date(),
        ...(triggered && { triggeredAt: new Date() }),
      },
    });

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const id = context?.params?.id;
  try {
    if (!prisma) {
      return new NextResponse('Service temporairement indisponible', { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alert = await prisma.alert.findFirst({
      where: {
        id,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!alert) {
      return new NextResponse('Alert not found', { status: 404 });
    }

    await prisma.alert.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 