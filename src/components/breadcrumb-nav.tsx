'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export function BreadcrumbNav() {
  const pathname = usePathname();
  // Split the URL into an array and remove empty strings (e.g., ['organization', '123', 'project', '456'])
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 max-w-4xl mx-auto px-8 pt-8">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Hub</span>
      </Link>

      {segments.length >= 2 && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link 
            href={`/organization/${segments[1]}`} 
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Workspace
          </Link>
        </>
      )}

      {segments.length >= 4 && segments[2] === 'project' && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            Project Environment
          </span>
        </>
      )}
    </nav>
  );
}