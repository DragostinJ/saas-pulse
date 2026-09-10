'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { buttonVariants } from '@/components/ui/button';

export function DatePicker({ name }: { name: string }) {
  const [date, setDate] = useState<Date>();

  return (
    <>
      <input 
        type="hidden" 
        name={name} 
        value={date ? date.toISOString() : ''} 
      />
      <Popover>
        <PopoverTrigger 
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-[200px] justify-start text-left font-normal bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100",
            !date && "text-slate-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Set deadline</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}