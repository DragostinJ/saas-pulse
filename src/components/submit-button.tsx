'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  label?: string;
  loadingLabel?: string;
}

export function SubmitButton({ 
  label = 'Submit', 
  loadingLabel = 'Submitting...' 
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="font-medium bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
    >
      {pending ? loadingLabel : label}
    </Button>
  );
}