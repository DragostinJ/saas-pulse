import { prisma } from '@/lib/prisma';
import { createOrganization } from '@/actions/organization';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  // Failsafe: if somehow the user reaches this component without a session, boot them.
  if (!userId) {
    redirect('/sign-in');
  }

  // Secure Server-Side Fetch: Only retrieve records matching the exact Clerk user token
  const organizations = await prisma.organization.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold">SaaS Pulse Architecture Test</h1>

      <form action={createOrganization} className="flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Enter Organization Name"
          className="border border-gray-300 p-2 rounded flex-1 text-black"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Create Org
        </button>
      </form>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">My Organizations:</h2>
        
        {organizations.length === 0 ? (
          <p className="text-gray-500">No organizations found. Create one above.</p>
        ) : (
          <ul className="border rounded divide-y text-white">
            {organizations.map((org) => (
              <li key={org.id} className="p-4 flex justify-between items-center">
                <span className="font-medium">{org.name}</span>
                <span className="text-sm font-mono text-gray-500">{org.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}