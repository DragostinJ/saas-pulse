'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { createOrganization } from '@/actions/organization';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';

export function CreateOrganizationForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    try {
      await createOrganization(formData);
      toast.success('Workspace created successfully');
      formRef.current?.reset();
    } catch (error) {
      // Next.js redirect throws an internal error which shouldn't be treated as a failure
      if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        return;
      }
      toast.error(error instanceof Error ? error.message : 'Failed to create workspace');
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="flex gap-4 max-w-md w-full">
      <Input
        type="text"
        name="name"
        placeholder="Enter Workspace Name"
        required
        className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
      />
      <SubmitButton label="Create Workspace" loadingLabel="Creating..." />
    </form>
  );
}
