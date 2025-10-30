"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, Trophy, Eye } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface AuctionActionsProps {
  auction: any;
}

export function AuctionActions({ auction }: AuctionActionsProps) {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startingPrice: auction.startingPrice?.toString() || "",
    reservePrice: auction.reservePrice?.toString() || "",
    minimumBid: auction.minimumBid?.toString() || "",
    bidIncrement: auction.bidIncrement?.toString() || "",
    buyNowPrice: auction.buyNowPrice?.toString() || "",
    endTime: auction.endTime.slice(0, 16),
  });

  // Check if current user is the owner of the NFT in the auction
  const isOwner = currentUser?.id === auction.nftItem?.ownerId;

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/auctions/${auction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startingPrice: formData.startingPrice
            ? parseFloat(formData.startingPrice)
            : undefined,
          reservePrice: formData.reservePrice
            ? parseFloat(formData.reservePrice)
            : undefined,
          minimumBid: formData.minimumBid
            ? parseFloat(formData.minimumBid)
            : undefined,
          bidIncrement: formData.bidIncrement
            ? parseFloat(formData.bidIncrement)
            : undefined,
          buyNowPrice: formData.buyNowPrice
            ? parseFloat(formData.buyNowPrice)
            : undefined,
          endTime: new Date(formData.endTime).toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update auction");
      }

      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating auction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update auction"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this auction?")) return;

    try {
      const response = await fetch(`/api/auctions/${auction.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete auction");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting auction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete auction"
      );
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/auctions/${auction.id}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete auction");
      }

      setCompleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error completing auction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to complete auction"
      );
    } finally {
      setLoading(false);
    }
  };

  // If user is not the owner, don't show action menu
  if (!isOwner) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <a href={`/auctions/${auction.id}`}>
          <Eye className="h-4 w-4" />
        </a>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {auction.status === "upcoming" && (
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          {auction.status === "live" && (
            <DropdownMenuItem onClick={() => setCompleteOpen(true)}>
              <Trophy className="h-4 w-4 mr-2" />
              Complete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <a href={`/auctions/${auction.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </a>
          </DropdownMenuItem>
          {auction.status === "upcoming" && (
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Auction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startingPrice">Starting Price (ETH)</Label>
              <Input
                type="number"
                step="0.0001"
                value={formData.startingPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startingPrice: e.target.value,
                  }))
                }
              />
            </div>

            {auction.type === "RESERVE" && (
              <div className="space-y-2">
                <Label htmlFor="reservePrice">Reserve Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.reservePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reservePrice: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {auction.type === "BUY_NOW" && (
              <div className="space-y-2">
                <Label htmlFor="buyNowPrice">Buy Now Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.buyNowPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      buyNowPrice: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Auction"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Auction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to complete this auction? This will
              determine the winner and transfer the NFT.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCompleteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? "Completing..." : "Complete Auction"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
