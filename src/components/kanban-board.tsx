'use client';

import { useEffect, useState, useTransition } from 'react';
import { TaskStatus } from '@prisma/client';
import { DndContext, DragEndEvent, closestCorners, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { updateTaskStatus } from '@/actions/task';
import { format } from 'date-fns';
import { TaskActions } from '@/components/task-actions';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  deadline: Date | null;
}

interface KanbanBoardProps {
  initialTasks: Task[];
  projectId: string;
  organizationId: string;
}

// 1. Strict Droppable Boundary
function Column({ id, title, children }: { id: TaskStatus; title: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 min-h-[500px] flex flex-col gap-4">
      <h3 className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-2">
        {title}
      </h3>
      <div 
        ref={setNodeRef} 
        className={`flex-grow flex flex-col gap-3 rounded-md transition-colors ${isOver ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

// 2. Strict Draggable Boundary
function TaskCard({ task, projectId, organizationId }: { task: Task, projectId: string, organizationId: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white dark:bg-slate-950 p-4 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 dark:hover:border-slate-700 transition-colors touch-none"
    >
      <div className="flex justify-between items-start mb-2">
        {/* pointer-events-none prevents text selection from interfering with the drag */}
        <span className="font-medium text-slate-900 dark:text-slate-100 text-sm pointer-events-none">
          {task.title}
        </span>
        {/* pointer-events-auto ensures the dropdown menu remains clickable */}
        <div className="pointer-events-auto cursor-default" onPointerDown={(e) => e.stopPropagation()}>
          <TaskActions taskId={task.id} projectId={projectId} organizationId={organizationId} />
        </div>
      </div>
      {task.deadline && (
        <span className="text-xs text-slate-500 font-mono pointer-events-none">
          Due: {format(new Date(task.deadline), 'MMM d')}
        </span>
      )}
    </div>
  );
}

export function KanbanBoard({ initialTasks, projectId, organizationId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [, startTransition] = useTransition();

  // 3. The Synchronization Layer: Force the client to adopt fresh server data
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Optimistic UI Update
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Background Server Sync
    startTransition(async () => {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('status', newStatus);
      formData.append('projectId', projectId);
      formData.append('organizationId', organizationId);
      
      try {
        await updateTaskStatus(formData);
      } catch (error) {
        console.error('Failed to update task status', error);
        setTasks(initialTasks); 
      }
    });
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {columns.map((column) => (
          <Column key={column.id} id={column.id} title={column.title}>
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  projectId={projectId} 
                  organizationId={organizationId} 
                />
              ))}
          </Column>
        ))}
      </div>
    </DndContext>
  );
}