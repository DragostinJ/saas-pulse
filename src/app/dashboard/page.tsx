import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  const totalProjects = await prisma.project.count({
    where: {
      organization: {
        members: {
          some: {
            userId: session.userId,
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Workspace Dashboard
      </h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Active Projects</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalProjects}</div>
          </div>
        </div>
      </div>
    </div>
  );
}