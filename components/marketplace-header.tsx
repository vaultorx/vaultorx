"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

interface MarketplaceHeaderProps {
  totalItems?: number
  onViewChange?: (view: "grid" | "list") => void
  onSortChange?: (sort: string) => void
  onToggleFilters?: () => void
}

export function MarketplaceHeader({
  totalItems = 0,
  onViewChange,
  onSortChange,
  onToggleFilters,
}: MarketplaceHeaderProps) {
  const [view, setView] = useState<"grid" | "list">("grid")

  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView)
    onViewChange?.(newView)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-1">{totalItems.toLocaleString()} items available</p>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button variant="outline" size="sm" className="gap-2 lg:hidden bg-transparent" onClick={onToggleFilters}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        <Select defaultValue="recent" onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Listed</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="most-viewed">Most Viewed</SelectItem>
            <SelectItem value="most-favorited">Most Favorited</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleViewChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleViewChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
