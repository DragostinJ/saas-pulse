import { Role } from '@prisma/client';
import { inviteMember, updateMemberRole } from '@/actions/member';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';

interface Member {
  id: string;
  userId: string;
  role: Role;
  organizationId: string;
}

interface MembersManagerProps {
  organizationId: string;
  members: Member[];
  currentUserId: string;
}

export function MembersManager({ organizationId, members, currentUserId }: MembersManagerProps) {
  const currentUserRole = members.find(m => m.userId === currentUserId)?.role;
  const isAdmin = currentUserRole === Role.ADMIN;

  return (
    <section className="bg-slate-100 dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">
          Workspace Members
        </h2>
        <ul className="flex flex-col gap-3">
          {members.map((member) => (
            <li key={member.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-700">
              <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                {member.userId === currentUserId ? 'You' : member.userId}
              </span>
              
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${member.role === Role.ADMIN ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {member.role}
                </span>

                {isAdmin && member.userId !== currentUserId && (
                  <form action={updateMemberRole}>
                    <input type="hidden" name="memberId" value={member.id} />
                    <input type="hidden" name="organizationId" value={organizationId} />
                    <input type="hidden" name="newRole" value={member.role === Role.ADMIN ? Role.MEMBER : Role.ADMIN} />
                    <button 
                      type="submit" 
                      className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Make {member.role === Role.ADMIN ? 'Member' : 'Admin'}
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
            Invite New Member
          </h3>
          <form action={inviteMember} className="flex gap-4 max-w-md">
            <input type="hidden" name="organizationId" value={organizationId} />
            <Input
              type="text"
              name="newMemberId"
              placeholder="Enter Clerk User ID"
              required
              className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            />
           <SubmitButton label="Invite Member" loadingLabel="Inviting..." />
          </form>
        </div>
      )}
    </section>
  );
}