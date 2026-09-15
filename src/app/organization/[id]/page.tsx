import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { deleteProject } from '@/actions/project';
import { CreateProjectForm } from '@/components/create-project-form';
import { DeleteButton } from '@/components/delete-button';
import Link from 'next/link';
import { MembersManager } from '@/components/members-manager';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';


interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const organization = await prisma.organization.findFirst({
    where: {
      id: id,
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      projects: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      members: true,
    },
  });

  if (!organization) {
    redirect('/');
  }

  // 1. Prisma Aggregations (Kept completely intact)
  const totalProjects = await prisma.project.count({
    where: { organizationId: id },
  });

  const totalTasks = await prisma.task.count({
    where: { project: { organizationId: id } },
  });

  const completedTasks = await prisma.task.count({
    where: { 
      project: { organizationId: id },
      status: 'DONE',
    },
  });

  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 2. Clerk Data Hydration with resilient fallback
  let hydratedMembers = organization.members.map((dbMember) => ({
    id: dbMember.id,
    userId: dbMember.userId,
    role: dbMember.role,
    name: dbMember.userId,
    imageUrl: '',
  }));

  try {
    const client = await clerkClient();
    const memberUserIds = organization.members.map((m) => m.userId);
    
    if (memberUserIds.length > 0) {
      const clerkUsers = await client.users.getUserList({
        userId: memberUserIds,
      });

      hydratedMembers = organization.members.map((dbMember) => {
        const clerkUser = clerkUsers.data.find((u) => u.id === dbMember.userId);
        
        const fullName = clerkUser?.firstName 
          ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() 
          : null;
          
        const fallbackName = clerkUser?.emailAddresses[0]?.emailAddress || dbMember.userId;

        return {
          id: dbMember.id,
          userId: dbMember.userId,
          role: dbMember.role,
          name: fullName || fallbackName,
          imageUrl: clerkUser?.imageUrl || '',
        };
      });
    }
  } catch (error) {
    console.warn('[Clerk Hydration Warning] Failed to fetch Clerk user details, using fallback data:', error);
  }

  // 3. Render the UI
  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <Link
        href={`/organization/${id}/billing`}
        className={cn(buttonVariants({ variant: 'outline' }), "w-fit mb-4")}
      >
        Manage Billing & Upgrades
      </Link>

      <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Dashboard
        </h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500">Total Projects</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalProjects}</span>
        </div>
        <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500">Active Tasks</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalTasks}</span>
        </div>
        <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500">Completion Rate</span>
          <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{progressPercentage}%</span>
        </div>
      </section>

      {/* Passing the newly hydrated data to the client component */}
      <MembersManager
        organizationId={organization.id}
        members={hydratedMembers}
        currentUserId={userId}
      />

      <section className="bg-slate-100 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-200">
          Deploy New Project
        </h2>
        <CreateProjectForm organizationId={organization.id} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-200">
          Active Projects
        </h2>
        {organization.projects.length === 0 ? (
          <p className="text-slate-500">No projects found. Deploy one above.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organization.projects.map((project) => (
              <li
                key={project.id}
                className="p-6 flex justify-between items-start rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm"
              >
                <Link
                  href={`/organization/${organization.id}/project/${project.id}`}
                  className="flex flex-col gap-2 flex-grow group"
                >
                  <span className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:underline">
                    {project.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {project.id}
                  </span>
                </Link>
                <form action={deleteProject} className="ml-4">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="organizationId" value={organization.id} />
                  <DeleteButton />
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}