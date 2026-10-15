'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import {z} from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
})


export async function createProject(formData: FormData) {

const {userId} = await auth();

if (!userId) {
  return {
  success: false,
  error: 'Unauthorized request'}
}
const validation = createProjectSchema.safeParse({
  name: formData.get('name'),
  organizationId: formData.get('organizationId'),
});
if (!validation.success) {
  return {
    success: false,
   error: validation.error.issues[0].message
  }
}
const organization = await prisma.organization.findFirst ({
  where:{
    id: validation.data.organizationId,
      members: {
    some: {
          userId: userId,
  },
},
}
})
if (!organization) {
return {
    success: false,
    error: 'Organization not found or access denied'}
}

await prisma.project.create({
  data: {
    name: validation.data.name,
    organizationId: validation.data.organizationId,
  },
});
revalidatePath(`/organization/${validation.data.organizationId}`);
return {
  success: true
}
}
const deleteProjectSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
})

export async function deleteProject(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: 'Unauthorized request'
    }
  }
const validation = deleteProjectSchema.safeParse({
 projectId: formData.get('projectId'),
 organizationId: formData.get('organizationId'),

})
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  // Deep relational zero-trust verification
  const project = await prisma.project.findFirst({
    where: {
      id: validation.data.projectId,
      organizationId: validation.data.organizationId,
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
    return {
      success: false,
      error: 'Project not found or unauthorized access attempt'
    };
  }

  await prisma.project.delete({
    where: {
      id: validation.data.projectId,
    },
  });

  revalidatePath(`/organization/${validation.data.organizationId}`);
  return {
    success: true,
  };
}