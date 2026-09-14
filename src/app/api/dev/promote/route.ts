import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Force-promote the currently logged-in developer to ADMIN across all their orgs
  await prisma.member.updateMany({
    where: { 
      userId: userId 
    },
    data: { 
      role: 'ADMIN' 
    },
  });

  // Redirect back to the homepage after successful database mutation
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return NextResponse.redirect(new URL('/', appUrl));
}