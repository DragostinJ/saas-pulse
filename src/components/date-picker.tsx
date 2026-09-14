'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  name?: string;
}

export function DatePicker({ name }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger 
        className={cn(
          buttonVariants({ variant: 'outline' }),
          "w-[240px] justify-start text-left font-normal border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
          !date && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a deadline</span>}
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setIsOpen(false); 
          }}
        />
      </PopoverContent>
      
      {name && date && <input type="hidden" name={name} value={date.toISOString()} />}
    </Popover>
  );
}