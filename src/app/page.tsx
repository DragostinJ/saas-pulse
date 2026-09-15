import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CreateOrganizationForm } from '@/components/create-organization-form';

export default async function HomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      projects: true,
      members: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="flex justify-between items-center pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Workspace Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your organizations and deployed projects.
          </p>
        </div>
      </header>

      <section className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">
          Deploy New Workspace
        </h2>
        <CreateOrganizationForm />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Your Workspaces
        </h2>
        {organizations.length === 0 ? (
          <p className="text-slate-500 text-sm">No organizations found. Deploy a new workspace above to get started.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org) => (
              <li 
                key={org.id} 
                className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm flex justify-between items-center"
              >
                <Link 
                  href={`/organization/${org.id}`} 
                  className="font-semibold text-lg text-slate-900 dark:text-slate-100 hover:underline"
                >
                  {org.name}
                </Link>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                  {org.projects.length} {org.projects.length === 1 ? 'Project' : 'Projects'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}