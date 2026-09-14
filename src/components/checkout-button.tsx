'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 font-semibold transition-colors"
    >
      {pending ? 'Connecting to Stripe...' : 'Upgrade to Pro'}
    </Button>
  );
}