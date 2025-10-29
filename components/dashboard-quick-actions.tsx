"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, ArrowUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { QuickAction } from "@/lib/types";

interface DashboardQuickActionsProps {
  actions: QuickAction[];
  loading?: boolean;
}

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {actions
            .filter((action) => action.enabled === true)
            .map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col gap-2 py-4 bg-transparent"
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="h-5 w-5" />
                  <span className="text-sm capitalize">{action.title}</span>
                </Link>
              </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
