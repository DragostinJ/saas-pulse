'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { TaskStatus } from '@prisma/client';

export async function createTask(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const title = formData.get('title') as string;
  const projectId = formData.get('projectId') as string;
  const organizationId = formData.get('organizationId') as string;

  if (!title || !projectId || !organizationId) {
    throw new Error('Missing required fields');
  }

  // Zero-trust verification: Ensure the project exists and belongs to the user's organization
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: organizationId,
      organization: {
        userId: userId,
      },
    },
  });

  if (!project) {
    throw new Error('Project not found or unauthorized access attempt');
  }

  await prisma.task.create({
    data: {
      title,
      projectId,
    },
  });

  revalidatePath(`/organization/${organizationId}/project/${projectId}`);
}

export async function updateTaskStatus(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const taskId = formData.get('taskId') as string;
  const status = formData.get('status') as TaskStatus;
  const projectId = formData.get('projectId') as string;
  const organizationId = formData.get('organizationId') as string;

  if (!taskId || !status || !projectId || !organizationId) {
    throw new Error('Missing required fields');
  }

  // Deep relational zero-trust verification
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId: projectId,
      project: {
        organizationId: organizationId,
        organization: {
          userId: userId,
        },
      },
    },
  });

  if (!task) {
    throw new Error('Task not found or unauthorized access attempt');
  }

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status: status,
    },
  });

  revalidatePath(`/organization/${organizationId}/project/${projectId}`);
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
          userId: userId,
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