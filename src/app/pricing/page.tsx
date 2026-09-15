import Link from 'next/link';
import { Check } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Transparent, Simple Pricing
        </h1>
        <p className="text-slate-500 mt-2">
          Scale your SaaS management without surprise limits.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full mt-4">
        {/* Free Tier */}
        <div className="flex flex-col p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Starter</h3>
          <p className="text-slate-500 mt-2">Perfect for evaluating the platform.</p>
          <p className="text-4xl font-bold mt-4 mb-6 text-slate-900 dark:text-slate-100">$0</p>
          <ul className="flex-1 space-y-3 mb-6">
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <Check className="h-5 w-5 text-slate-400 mr-2" />
              Up to 2 Active Projects
            </li>
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <Check className="h-5 w-5 text-slate-400 mr-2" />
              Basic Kanban Board
            </li>
          </ul>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: 'outline' }), "w-full")}
          >
            Get Started
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="flex flex-col p-6 bg-white dark:bg-slate-950 rounded-lg border-2 border-indigo-500 shadow-md relative">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-sm">
            POPULAR
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pro</h3>
          <p className="text-slate-500 mt-2">For teams that need maximum velocity.</p>
          <p className="text-4xl font-bold mt-4 mb-6 text-slate-900 dark:text-slate-100">
            $20<span className="text-lg text-slate-500 font-normal">/month</span>
          </p>
          <ul className="flex-1 space-y-3 mb-6">
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <Check className="h-5 w-5 text-indigo-500 mr-2" />
              Unlimited Projects
            </li>
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <Check className="h-5 w-5 text-indigo-500 mr-2" />
              Advanced Member Roles
            </li>
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <Check className="h-5 w-5 text-indigo-500 mr-2" />
              Priority Support
            </li>
          </ul>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: 'default' }), "w-full bg-indigo-600 hover:bg-indigo-700 text-white")}
          >
            Upgrade in Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
