import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Dashboard
        </h1>
      </header>

      <section className="flex flex-col gap-4">
        {organizations.length === 0 ? (
          <p className="text-slate-500 text-sm">No organizations found. Deploy a new workspace to get started.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org) => (
              <li 
                key={org.id} 
                className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <Link 
                  href={`/organization/${org.id}`} 
                  className="font-semibold text-lg text-slate-900 dark:text-slate-100 hover:underline"
                >
                  {org.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}