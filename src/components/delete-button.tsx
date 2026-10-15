'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteProject } from '@/actions/project';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteProjectButtonProps {
  projectId: string;
  organizationId: string;
}

export function DeleteProjectButton({ projectId, organizationId }: DeleteProjectButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('organizationId', organizationId);

      const result = await deleteProject(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success('Project deleted successfully');
    });
  };

  return (
    <Button 
      type="button" 
      variant="destructive" 
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 ml-4"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      <span className="sr-only">Delete</span>
    </Button>
  );
}