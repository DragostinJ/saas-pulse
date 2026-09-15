import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Building2 } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Fetch all organizations where the current Clerk user is a member
  const memberships = await prisma.member.findMany({
    where: { userId },
    include: {
      organization: {
        include: {
          projects: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const organizations = memberships.map((m) => m.organization);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workspace Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your SaaS Pulse organizations and active projects.</p>
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No organizations found</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">Create or select an organization using the top navigation bar to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/organization/${org.id}`}
              className="group block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                  {org.projects.length} Projects
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {org.name}
              </h2>
              <p className="text-sm text-slate-500 mt-2">Created on {new Date(org.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}