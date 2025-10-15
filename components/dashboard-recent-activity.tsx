"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Activity {
  id: string
  type: "mint" | "sale" | "transfer" | "listing"
  nftName: string
  price?: string
  from?: string
  to?: string
  timestamp: string
  txHash: string
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "sale",
    nftName: "Ethereal Dreams #1234",
    price: "3.8 ETH",
    from: "0x1234...5678",
    to: "0xabcd...efgh",
    timestamp: "2 hours ago",
    txHash: "0xabc123...",
  },
  {
    id: "2",
    type: "listing",
    nftName: "Cosmic Vision #567",
    price: "2.5 ETH",
    timestamp: "5 hours ago",
    txHash: "0xdef456...",
  },
  {
    id: "3",
    type: "mint",
    nftName: "Digital Horizon #89",
    timestamp: "1 day ago",
    txHash: "0xghi789...",
  },
  {
    id: "4",
    type: "transfer",
    nftName: "Abstract Reality #234",
    from: "0x9876...5432",
    to: "0x1234...5678",
    timestamp: "2 days ago",
    txHash: "0xjkl012...",
  },
]

export function DashboardRecentActivity() {
  const getActivityBadge = (type: Activity["type"]) => {
    const variants = {
      mint: "default",
      sale: "default",
      transfer: "secondary",
      listing: "secondary",
    } as const

    return (
      <Badge variant={variants[type]} className="capitalize">
        {type}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getActivityBadge(activity.type)}
                  <span className="font-medium truncate">{activity.nftName}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.price && <span className="font-medium text-foreground">{activity.price}</span>}
                  {activity.from && activity.to && (
                    <span>
                      {" "}
                      from {activity.from} to {activity.to}
                    </span>
                  )}
                  <span className="ml-2">{activity.timestamp}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0" asChild>
                <a href={`https://etherscan.io/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer">
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
  )
}
