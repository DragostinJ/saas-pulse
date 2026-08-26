'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface ManageProjectButtonProps {
  readonly projectId: string;
}

export function ManageProjectButton({ projectId }: ManageProjectButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleManageClick = async () => {
    setIsPending(true);
    
    // Simulating a network request or router push
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log(`Navigating to project dashboard for: ${projectId}`);
    setIsPending(false);
  };

  return (
    <Button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      onClick={handleManageClick}
      disabled={isPending}
    >
      {isPending ? "Loading Dashboard..." : "Manage Project"}
    </Button>
  );
}