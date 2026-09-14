'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateMemberRole(memberId: string, newRole: string, organizationId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized action');
  }

  const adminCount = await prisma.member.count({
    where: {
      organizationId,
      role: 'ADMIN',
    },
  });

  const currentMember = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (!currentMember) {
    throw new Error('Forbidden: You are not a member of this organization');
  }

  const isAdmin = currentMember.role === 'ADMIN';

  if (!isAdmin && adminCount > 0) {
    throw new Error('Forbidden: Only administrators can modify member roles');
  }

  await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      role: newRole as any,
    },
  });

  revalidatePath(`/organization/${organizationId}`);
}