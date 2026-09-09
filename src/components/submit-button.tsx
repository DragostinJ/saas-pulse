'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-slate-100 text-slate-900 hover:bg-slate-200 font-semibold"
    >
      {pending ? 'Creating...' : 'Create Org'}
    </Button>
  );
}