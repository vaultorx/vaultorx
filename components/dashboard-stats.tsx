"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, ShoppingBag, DollarSign, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change?: number
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div
                className={cn("flex items-center gap-1 mt-2 text-sm", change >= 0 ? "text-green-500" : "text-red-500")}
              >
                {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(change)}%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Wallet Balance" value="12.45 ETH" change={8.2} icon={<Wallet className="h-6 w-6" />} />
      <StatCard title="Total NFTs" value="24" change={12.5} icon={<ShoppingBag className="h-6 w-6" />} />
      <StatCard title="Total Value" value="$31,250" change={-3.1} icon={<DollarSign className="h-6 w-6" />} />
      <StatCard title="Active Listings" value="8" icon={<Activity className="h-6 w-6" />} />
    </div>
  )
}
