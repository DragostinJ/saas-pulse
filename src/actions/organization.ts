'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function createOrganization(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized: You must be logged in to perform this action.');
  }

  const name = formData.get('name') as string;

  if (!name || name.trim() === '') {
    throw new Error('Organization name is required');
  }

  // Pass the Clerk userId directly to Supabase
  await prisma.organization.create({
    data: {
      name,
      userId, 
    },
  });

  revalidatePath('/');
}