"use client";

import { useEffect, useState } from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import type { Appearance } from "@clerk/types";

export function NavbarAuth() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  const orgAppearance: Appearance = {
    baseTheme: resolvedTheme === "dark" ? dark : undefined,
    elements: {
      organizationSwitcherTrigger: "text-foreground focus:ring-2 focus:ring-primary"
    }
  };

  const userAppearance: Appearance = {
    baseTheme: resolvedTheme === "dark" ? dark : undefined
  };

  return (
    <div className="flex items-center gap-4">
      <OrganizationSwitcher 
        hidePersonal 
        appearance={orgAppearance}
        afterCreateOrganizationUrl="/organization/:id"
        afterLeaveOrganizationUrl="/select-org"
        afterSelectOrganizationUrl="/organization/:id"
      />
      <UserButton appearance={userAppearance} />
    </div>
  );
}