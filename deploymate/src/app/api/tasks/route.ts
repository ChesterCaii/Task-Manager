import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/app/lib/auth/auth';
import { CreateTaskRequest } from '@/app/types/task';
import { sendTaskAssignmentEmail } from '@/app/lib/email/email';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.id as string,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateTaskRequest = await request.json();
    const { title, description, dueDate } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        userId: session.id as string,
      },
    });

    // Get user for email notification
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    });

    if (user) {
      // Send task assignment email notification
      await sendTaskAssignmentEmail(user, title, description || '');
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 