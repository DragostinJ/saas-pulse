import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { createTask, updateTaskStatus } from '@/actions/task';
import { TaskActions } from '@/components/task-actions';


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
        userId: userId,
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
        <form action={createTask} className="flex gap-4 max-w-md">
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="organizationId" value={id} />
          <Input
            type="text"
            name="title"
            placeholder="What needs to be done?"
            required
            className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
          />
          <SubmitButton />
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-200">
          Task Backlog
        </h2>
        
        {project.tasks.length === 0 ? (
          <p className="text-slate-500">No tasks found. Create one above.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
          {project.tasks.map((task) => (
              <li 
                key={task.id} 
                className="p-4 flex justify-between items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {task.title}
                </span>
                
                <div className="flex items-center gap-2">
                  <form action={updateTaskStatus}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="organizationId" value={id} />
                    <input 
                      type="hidden" 
                      name="status" 
                      value={
                        task.status === 'TODO' 
                          ? 'IN_PROGRESS' 
                          : task.status === 'IN_PROGRESS' 
                          ? 'DONE' 
                          : 'TODO'
                      } 
                    />
                    <button 
                      type="submit"
                      className="text-xs px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {task.status}
                    </button>
                  </form>

                  <TaskActions 
                    taskId={task.id} 
                    projectId={project.id} 
                    organizationId={id} 
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}