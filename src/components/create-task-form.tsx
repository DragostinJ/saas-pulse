'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { createTask } from '@/actions/task';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker';

interface CreateTaskFormProps {
  projectId: string;
  organizationId: string;
}

export function CreateTaskForm({ projectId, organizationId }: CreateTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAction = async (formData: FormData) => {
    try {
      await createTask(formData);
      toast.success('Task created successfully');
      formRef.current?.reset();
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="flex gap-4 max-w-3xl flex-wrap">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="organizationId" value={organizationId} />
      
      <Input
        type="text"
        name="title"
        placeholder="What needs to be done?"
        required
        className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 flex-1 min-w-[250px]"
      />
      
      <DatePicker name="deadline" />
      <SubmitButton label="Create Task" loadingLabel="Creating..." />
    </form>
  );
}