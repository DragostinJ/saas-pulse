import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createProject, deleteProject } from '@/actions/project';
import { SubmitButton } from '@/components/submit-button';
import { DeleteButton } from '@/components/delete-button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  // 1. Resolve the asynchronous parameters first
  const { id } = await params;
  
  // 2. Resolve the authentication state
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // 3. Execute the strictly typed database query
  const organization = await prisma.organization.findUnique({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      projects: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!organization) {
    redirect('/');
  }

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {organization.name} Workspace
        </h1>
      </header>

      <section className="bg-slate-100 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-200">
          Deploy New Project
        </h2>
        <form action={createProject} className="flex gap-4 max-w-md">
          <input type="hidden" name="organizationId" value={organization.id} />
          <Input
            type="text"
            name="name"
            placeholder="Enter Project Name"
            required
            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
          />
          <SubmitButton />
        </form>
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
                className="p-6 flex justify-between items-start rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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