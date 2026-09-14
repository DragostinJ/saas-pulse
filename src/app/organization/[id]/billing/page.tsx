import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PricingTable } from '@/components/pricing-table';

interface BillingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BillingPage({ params }: BillingPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Billing
        </h1>
        <p className="text-slate-500 mt-2">Manage your subscription and upgrade to Pro.</p>
      </header>

      <PricingTable organizationId={id} />
    </main>
  );
}