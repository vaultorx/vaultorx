"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface CreateAuctionFormProps {
  userNFTs: any[];
}

export function CreateAuctionForm({ userNFTs }: CreateAuctionFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nftItemId: "",
    type: "STANDARD",
    startingPrice: "",
    reservePrice: "",
    minimumBid: "",
    bidIncrement: "",
    buyNowPrice: "",
    ticketPrice: "",
    maxTickets: "",
    startTime: "",
    endTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
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
          ticketPrice: formData.ticketPrice
            ? parseFloat(formData.ticketPrice)
            : undefined,
          maxTickets: formData.maxTickets
            ? parseInt(formData.maxTickets)
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create auction");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating auction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showReservePrice = ["RESERVE"].includes(formData.type);
  const showBuyNowPrice = ["BUY_NOW"].includes(formData.type);
  const showLotteryFields = ["LOTTERY"].includes(formData.type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Auction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Auction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NFT Selection */}
          <div className="space-y-2">
            <Label htmlFor="nftItemId">Select NFT</Label>
            <Select onValueChange={(value) => handleChange("nftItemId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an NFT to auction" />
              </SelectTrigger>
              <SelectContent>
                {userNFTs.map((nft) => (
                  <SelectItem key={nft.id} value={nft.id}>
                    {nft.name} - {nft.collection?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Auction Type</Label>
            <Select onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select auction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STANDARD">Standard Auction</SelectItem>
                <SelectItem value="RESERVE">Reserve Auction</SelectItem>
                <SelectItem value="TIMED">Timed Auction</SelectItem>
                <SelectItem value="LOTTERY">Lottery</SelectItem>
                <SelectItem value="BUY_NOW">Buy Now</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Starting Price */}
          <div className="space-y-2">
            <Label htmlFor="startingPrice">Starting Price (ETH)</Label>
            <Input
              type="number"
              step="0.0001"
              placeholder="0.00"
              value={formData.startingPrice}
              onChange={(e) => handleChange("startingPrice", e.target.value)}
            />
          </div>

          {/* Reserve Price */}
          {showReservePrice && (
            <div className="space-y-2">
              <Label htmlFor="reservePrice">Reserve Price (ETH)</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.00"
                value={formData.reservePrice}
                onChange={(e) => handleChange("reservePrice", e.target.value)}
              />
            </div>
          )}

          {/* Buy Now Price */}
          {showBuyNowPrice && (
            <div className="space-y-2">
              <Label htmlFor="buyNowPrice">Buy Now Price (ETH)</Label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.00"
                value={formData.buyNowPrice}
                onChange={(e) => handleChange("buyNowPrice", e.target.value)}
              />
            </div>
          )}

          {/* Lottery Fields */}
          {showLotteryFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="0.00"
                  value={formData.ticketPrice}
                  onChange={(e) => handleChange("ticketPrice", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTickets">Maximum Tickets</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={formData.maxTickets}
                  onChange={(e) => handleChange("maxTickets", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Minimum Bid & Bid Increment */}
          {!showLotteryFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="minimumBid">Minimum Bid (ETH)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="0.00"
                  value={formData.minimumBid}
                  onChange={(e) => handleChange("minimumBid", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bidIncrement">Bid Increment (ETH)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="0.00"
                  value={formData.bidIncrement}
                  onChange={(e) => handleChange("bidIncrement", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Time Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Auction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
