'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type Role = 'ADMIN' | 'MEMBER';

export async function createOrganization(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Organization name is required');
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: 'ADMIN' as Role,
        },
      },
    },
  });

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect(`/organization/${organization.id}`);
}