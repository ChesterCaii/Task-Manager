import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/app/lib/auth/auth';
import { UpdateTaskRequest, TaskStatus } from '@/app/types/task';
import { sendTaskUpdateEmail, sendTaskCompletionEmail } from '@/app/lib/email/email';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.userId !== session.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.userId !== session.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body: UpdateTaskRequest = await request.json();
    const { title, description, status, dueDate } = body;

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate }),
      },
    });

    // Get user for email notification
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    });

    if (user) {
      // Check if task was completed
      if (status === TaskStatus.COMPLETED && task.status !== TaskStatus.COMPLETED) {
        await sendTaskCompletionEmail(user, updatedTask.title);
      } else if (status || title || description || dueDate) {
        // Send update email if something changed
        const updateMessage = `Your task "${updatedTask.title}" has been updated.`;
        await sendTaskUpdateEmail(user, updatedTask.title, updateMessage);
      }
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (task.userId !== session.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await prisma.task.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 