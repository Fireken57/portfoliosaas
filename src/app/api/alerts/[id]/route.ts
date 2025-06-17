import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alert = await prisma.alert.findFirst({
      where: {
        id: params.id,
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

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { type, symbol, condition, value, triggered, message } = body;

    const alert = await prisma.alert.findFirst({
      where: {
        id: params.id,
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
        id: params.id,
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

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alert = await prisma.alert.findFirst({
      where: {
        id: params.id,
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
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 