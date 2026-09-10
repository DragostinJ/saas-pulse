import { Skeleton } from '@/components/ui/skeleton';

export default function OrganizationLoading() {
  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col gap-8 w-full">
      <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <Skeleton className="h-9 w-64 mb-2" />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </section>

      <section className="bg-slate-100 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex gap-4 max-w-md">
          <Skeleton className="h-10 flex-grow rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-36 mb-2" />
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="p-6 h-[90px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col gap-2"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </ul>
      </section>
    </main>
  );
}