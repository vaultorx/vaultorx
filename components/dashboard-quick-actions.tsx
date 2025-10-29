"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuickAction } from "@/lib/types";
import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

// Create a mapping of icon names to components
const iconMap = {
  Upload: LucideIcons.Upload,
  Download: LucideIcons.Download,
  Plus: LucideIcons.Plus,
  Ticket: LucideIcons.Ticket,
  // Add more icons as needed
};

interface DashboardQuickActionsProps {
  actions: QuickAction[];
  loading?: boolean;
}

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  const [iconComponents, setIconComponents] = useState<{
    [key: string]: React.ComponentType<any>;
  }>({});

  // This ensures icons are only loaded on client side
  useEffect(() => {
    setIconComponents(iconMap);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {actions
            .filter((action) => action.enabled === true)
            .map((action) => {
              const IconComponent =
                iconComponents[action.icon as unknown as string];

              if (!IconComponent) {
                console.warn(`Icon not found: ${action.icon}`);
                return null;
              }

              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto flex-col gap-2 py-4 bg-transparent"
                  asChild
                >
                  <Link href={action.href}>
                    <IconComponent className="h-5 w-5" />
                    <span className="text-sm capitalize">{action.title}</span>
                  </Link>
                </Button>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
