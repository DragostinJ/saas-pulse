'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className={buttonVariants({ 
          variant: 'outline', 
          size: 'icon', 
          className: 'border-slate-800 bg-slate-950 text-slate-100 hover:bg-slate-900 cursor-pointer' 
        })}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="border-slate-800 bg-slate-950 text-slate-100">
        <DropdownMenuItem onClick={() => setTheme('light')} className="focus:bg-slate-900 focus:text-slate-100 cursor-pointer">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="focus:bg-slate-900 focus:text-slate-100 cursor-pointer">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="focus:bg-slate-900 focus:text-slate-100 cursor-pointer">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}