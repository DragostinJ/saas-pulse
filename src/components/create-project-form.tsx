'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { createProject } from '@/actions/project';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';

interface CreateProjectFormProps {
  organizationId: string;
}

export function CreateProjectForm({ organizationId }: CreateProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    try {
      await createProject(formData);
      toast.success('Project deployed successfully');
      formRef.current?.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to deploy project');
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="flex gap-4 max-w-md">
      <input type="hidden" name="organizationId" value={organizationId} />
      <Input
        type="text"
        name="name"
        placeholder="Enter Project Name"
        required
        className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
      />
      <SubmitButton label="Deploy Project" loadingLabel="Deploying..." />
    </form>
  );
}
