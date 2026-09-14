import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-bold tracking-tight text-slate-900 dark:text-slate-100">
          SaaS Pulse
        </Link>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher 
            hidePersonal
            afterCreateOrganizationUrl="/organization/:id"
            afterLeaveOrganizationUrl="/select-org"
            afterSelectOrganizationUrl="/organization/:id"
          />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}