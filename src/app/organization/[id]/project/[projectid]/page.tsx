import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/kanban-board';
import { CreateTaskForm } from '@/components/create-task-form';

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
        <CreateTaskForm projectId={project.id} organizationId={id} />
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