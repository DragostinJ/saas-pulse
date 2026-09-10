import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createTask, updateTaskStatus } from '@/actions/task';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { TaskActions } from '@/components/task-actions';
import { DatePicker } from '@/components/date-picker';
import { format } from 'date-fns';
import { KanbanBoard } from '@/components/kanban-board';

interface ProjectPageProps {
  params: Promise<{
    id: string;
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id, projectId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Deep relational zero-trust verification for the UI render
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: id,
      organization: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!project) {
    // Eject unauthorized users who try to guess the URL
    redirect(`/organization/${id}`);
  }

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {project.name} Environment
        </h1>
        <p className="text-slate-500 mt-2 font-mono text-sm">Project ID: {project.id}</p>
      </header>

      <section className="bg-slate-100 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-200">
          Create New Task
        </h2>
        <form action={createTask} className="flex gap-4 max-w-3xl flex-wrap">
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="organizationId" value={id} />
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
      </section>

     <section className="flex flex-col gap-4">
  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-200">
    Sprint Board
  </h2>
  
  {project.tasks.length === 0 ? (
    <p className="text-slate-500">No tasks found. Create one above.</p>
  ) : (
    <KanbanBoard 
      initialTasks={project.tasks} 
      projectId={project.id} 
      organizationId={id} 
    />
  )}
</section>
    </main>
  );
}