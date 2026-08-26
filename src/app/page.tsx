import { Suspense } from "react";
import { ProjectSummary } from "@/components/dashboard/project-summary";
import { ProjectSkeleton } from "@/components/dashboard/project-skeleton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <div className="max-w-3xl w-full text-center space-y-8 flex flex-col items-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight">
            SaaS Pulse
          </h1>
          <p className="text-xl text-muted-foreground">
            Next.js 14 App Router environment verified.
          </p>
        </div>
        
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectSummary />
        </Suspense>
      </div>
    </main>
  );
}