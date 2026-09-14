import { createCheckoutSession } from '@/actions/stripe';
import { CheckoutButton } from '@/components/checkout-button';
import { Check } from 'lucide-react';

interface PricingTableProps {
  organizationId: string;
}

export function PricingTable({ organizationId }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
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
        <button disabled className="w-full py-2 px-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold cursor-not-allowed">
          Current Plan
        </button>
      </div>

      {/* Pro Tier */}
      <div className="flex flex-col p-6 bg-white dark:bg-slate-950 rounded-lg border-2 border-indigo-500 shadow-md relative">
        <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-sm">
          UNLIMITED
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pro</h3>
        <p className="text-slate-500 mt-2">For teams that need maximum velocity.</p>
        <p className="text-4xl font-bold mt-4 mb-6 text-slate-900 dark:text-slate-100">$20<span className="text-lg text-slate-500 font-normal">/month</span></p>
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
        
        {/* Zero-JS Form Submission passing FormData to the Server Action */}
        <form action={createCheckoutSession}>
          <input type="hidden" name="organizationId" value={organizationId} />
          <CheckoutButton />
        </form>
      </div>
    </div>
  );
}