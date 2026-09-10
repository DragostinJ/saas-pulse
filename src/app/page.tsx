import { prisma } from '@/lib/prisma';
import { createOrganization } from '@/actions/organization';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/submit-button';
import { ModeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

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
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center pb-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold tracking-tight">SaaS Pulse</h1>
       <ModeToggle />
       <UserButton/>
       
      </header>

      <section className="bg-slate-950 p-6 rounded-lg border border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">Create New Organization</h2>
        <form action={createOrganization} className="flex gap-4 max-w-md">
          <Input
            type="text"
            name="name"
            placeholder="Enter Organization Name"
            required
            className="bg-slate-900 border-slate-700 text-slate-100"
          />
          <SubmitButton />
        </form>
      </section>



     <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900">My Organizations</h2>
        
      {organizations.length === 0 ? (
  <p className="text-slate-500">No organizations found. Create one above.</p>
) : (
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {organizations.map((org) => (
      <Link 
        key={org.id} 
        href={`/organization/${org.id}`}
        className="block group"
      >
        <li className="p-6 flex flex-col gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 group-hover:border-slate-400 dark:group-hover:border-slate-700 transition-colors">
          <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">
            {org.name}
          </span>
          <span className="text-xs font-mono text-slate-500">
            ID: {org.id}
          </span>
          <span className="text-xs text-slate-400 mt-2">
            Created {new Date(org.createdAt).toLocaleDateString()}
          </span>
        </li>
      </Link>
    ))}
  </ul>
)}
      </section>
    </main>
  );
}