'use client';

import { updateMemberRole } from '@/actions/members';
import { useTransition } from 'react';

interface HydratedMember {
  id: string;
  userId: string;
  role: string;
  name: string;
  imageUrl?: string;
}

interface MembersManagerProps {
  organizationId: string;
  members: HydratedMember[];
  currentUserId: string;
}

export function MembersManager({ organizationId, members, currentUserId }: MembersManagerProps) {
  const [isPending, startTransition] = useTransition();
  
  const currentMember = members.find((m) => m.userId === currentUserId);
  const adminCount = members.filter((m) => m.role === 'ADMIN').length;
  
  const canManage = currentMember?.role === 'ADMIN' || adminCount === 0;

  return (
    <section className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100">Team Members</h3>
        {canManage && (
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-950 text-indigo-300 rounded-full">
            Admin Control Panel
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-800">
        {members.map((member) => (
          <div key={member.id} className="py-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-slate-300">{member.name}</span>
            </div>
            
            {canManage ? (
              <select
                disabled={isPending || (member.userId === currentUserId && adminCount === 1)}
                defaultValue={member.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  startTransition(async () => {
                    await updateMemberRole(member.id, newRole, organizationId);
                  });
                }}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs font-semibold uppercase text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            ) : (
              <span className="uppercase text-xs font-bold text-slate-500">{member.role}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}