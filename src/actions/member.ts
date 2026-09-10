'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

export async function inviteMember(formData: FormData) {
  const { userId: requesterId } = await auth();
  if (!requesterId) throw new Error('Unauthorized request');

  const organizationId = formData.get('organizationId') as string;
  const newMemberId = formData.get('newMemberId') as string; // In a production app, this would be an email lookup. For your portfolio, we pass the Clerk ID directly.

  if (!organizationId || !newMemberId) {
    throw new Error('Missing required fields');
  }

  // Zero-trust verification: Ensure the requester is an ADMIN of this organization
  const adminCheck = await prisma.member.findUnique({
    where: {
      userId_organizationId: {
        userId: requesterId,
        organizationId: organizationId,
      },
    },
  });

  if (!adminCheck || adminCheck.role !== Role.ADMIN) {
    throw new Error('Only administrators can invite new members');
  }

  await prisma.member.create({
    data: {
      userId: newMemberId,
      organizationId: organizationId,
      role: Role.MEMBER, // Default to lowest privilege
    },
  });

  revalidatePath(`/organization/${organizationId}`);
}

export async function updateMemberRole(formData: FormData) {
  const { userId: requesterId } = await auth();
  if (!requesterId) throw new Error('Unauthorized request');

  const memberId = formData.get('memberId') as string;
  const organizationId = formData.get('organizationId') as string;
  const newRole = formData.get('newRole') as Role;

  if (!memberId || !organizationId || !newRole) {
    throw new Error('Missing required fields');
  }

  // Zero-trust verification: Ensure the requester is an ADMIN
  const adminCheck = await prisma.member.findUnique({
    where: {
      userId_organizationId: {
        userId: requesterId,
        organizationId: organizationId,
      },
    },
  });

  if (!adminCheck || adminCheck.role !== Role.ADMIN) {
    throw new Error('Only administrators can change roles');
  }

  await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      role: newRole,
    },
  });

  revalidatePath(`/organization/${organizationId}`);
}