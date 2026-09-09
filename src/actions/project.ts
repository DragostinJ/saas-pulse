'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const name = formData.get('name') as string;
  const organizationId = formData.get('organizationId') as string;

  if (!name || !organizationId) {
    throw new Error('Missing required fields');
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      userId: userId,
    },
  });

  if (!organization) {
    throw new Error('Organization not found or unauthorized access attempt');
  }

  await prisma.project.create({
    data: {
      name,
      organizationId,
    },
  });

  revalidatePath(`/organization/${organizationId}`);
}

export async function deleteProject(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const projectId = formData.get('projectId') as string;
  const organizationId = formData.get('organizationId') as string;

  if (!projectId || !organizationId) {
    throw new Error('Missing required fields');
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organization: {
        userId: userId,
      },
    },
  });

  if (!project) {
    throw new Error('Project not found or unauthorized access attempt');
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  revalidatePath(`/organization/${organizationId}`);
}