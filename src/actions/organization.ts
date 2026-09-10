'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

export async function createOrganization(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized request');
  }

  const name = formData.get('name') as string;

  if (!name || name.trim() === '') {
    throw new Error('Organization name is required');
  }

  await prisma.organization.create({
    data: {
      name: name.trim(),
      members: {
        create: {
          userId: userId,
          role: Role.ADMIN,
        },
      },
    },
  });

  revalidatePath('/');
}