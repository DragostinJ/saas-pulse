'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      variant="destructive" 
      size="icon"
      disabled={pending}
      className="h-8 w-8"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  );
}