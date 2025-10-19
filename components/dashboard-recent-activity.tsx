"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { RecentActivity } from "@/lib/types";
import { format } from "date-fns";

interface DashboardActivityProps {
  activities: RecentActivity[];
}

export function DashboardRecentActivity({
  activities,
}: DashboardActivityProps) {

  const getActivityBadge = (type: RecentActivity["type"]) => {
    const variants = {
      mint: "default",
      sale: "default",
      purchase: "default",
      transfer: "secondary",
      listing: "secondary",
      bid: "secondary",
    } as const;

    return (
      <Badge variant={variants[type]} className="capitalize">
        {type}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityBadge(activity.type)}
                  <span className="font-medium truncate">
                    {activity.nftName}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.price && (
                    <span className="font-medium text-foreground">
                      {activity.price}
                    </span>
                  )}
                  {activity.from && activity.to && (
                    <span>
                      {" "}
                      from {activity.from} to {activity.to}
                    </span>
                  )}
                  <span className="ml-2">
                    {format(new Date(activity.timestamp), "yyyy-MM-dd")}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                asChild
              >
                <a
                  href={`https://etherscan.io/tx/${activity.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
