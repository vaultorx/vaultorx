"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, MoreHorizontal, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NFTDetailHeaderProps {
  collectionName: string
  nftName: string
  isVerified?: boolean
}

export function NFTDetailHeader({ collectionName, nftName, isVerified = false }: NFTDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hover:text-primary cursor-pointer">{collectionName}</span>
        {isVerified && <Badge variant="secondary">Verified</Badge>}
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{nftName}</h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Etherscan
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View IPFS Metadata
              </DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
