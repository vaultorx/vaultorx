"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, ArrowUpDown, Plus } from "lucide-react"
import Link from "next/link"

export function DashboardQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
            <Link href="/dashboard/create">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Mint NFT</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
            <Link href="/dashboard/deposit">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Deposit</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent" asChild>
            <Link href="/dashboard/withdraw">
              <Download className="h-5 w-5" />
              <span className="text-sm">Withdraw</span>
            </Link>
          </Button>

          <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <ArrowUpDown className="h-5 w-5" />
            <span className="text-sm">Transfer</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
