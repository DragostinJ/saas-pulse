'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the type locally to replace the broken Prisma enum export
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export async function createTask(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const title = formData.get('title') as string;
  const projectId = formData.get('projectId') as string;
  const organizationId = formData.get('organizationId') as string;
  const rawDeadline = formData.get('deadline') as string;

  if (!title || !projectId || !organizationId) {
    throw new Error('Missing required fields');
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organizationId,
      organization: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    },
  });

  if (!project) {
    throw new Error('Project not found or unauthorized access attempt');
  }

  const deadline = rawDeadline ? new Date(rawDeadline) : null;

  await prisma.task.create({
    data: {
      title,
      projectId,
      deadline,
      status: 'TODO', 
    },
  });

  revalidatePath(`/organization/${organizationId}/project/${projectId}`);
}

const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], { message: 'Invalid task status' }),
  projectId: z.string().min(1, 'Project ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
});

export async function updateTaskStatus(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized request',
    };
  }

  const validation = updateTaskStatusSchema.safeParse({
    taskId: formData.get('taskId'),
    status: formData.get('status'),
    projectId: formData.get('projectId'),
    organizationId: formData.get('organizationId'),
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const task = await prisma.task.findFirst({
    where: {
      id: validation.data.taskId,
      projectId: validation.data.projectId,
      project: {
        organizationId: validation.data.organizationId,
        organization: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
    },
  });

  if (!task) {
    return {
      success: false,
      error: 'Task not found or unauthorized access attempt',
    };
  }

  await prisma.task.update({
    where: {
      id: validation.data.taskId,
    },
    data: {
      status: validation.data.status,
    },
  });

  revalidatePath(`/organization/${validation.data.organizationId}/project/${validation.data.projectId}`);
  return {
    success: true,
  };
}

export async function deleteTask(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const taskId = formData.get('taskId') as string;
  const projectId = formData.get('projectId') as string;
  const organizationId = formData.get('organizationId') as string;

  if (!taskId || !projectId || !organizationId) {
    throw new Error('Missing required fields');
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId: projectId,
      project: {
        organizationId: organizationId,
        organization: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new Error('Task not found or unauthorized access attempt');
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  revalidatePath(`/organization/${organizationId}/project/${projectId}`);
}