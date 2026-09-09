'use client';

import { useTransition } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteTask } from '@/actions/task';

interface TaskActionsProps {
  taskId: string;
  projectId: string;
  organizationId: string;
}

export function TaskActions({ taskId, projectId, organizationId }: TaskActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('projectId', projectId);
      formData.append('organizationId', organizationId);
      await deleteTask(formData);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 transition-colors"
      >
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4 text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Task</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}