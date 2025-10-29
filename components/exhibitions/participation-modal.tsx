"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, X, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

interface NFTItem {
  id: string;
  name: string;
  image: string;
  collection: {
    name: string;
  };
}

interface Collection {
  id: string;
  name: string;
  image: string;
  verified: boolean;
}

interface ParticipationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibition: {
    id: string;
    title: string;
  };
  onSuccess: () => void;
}

export default function ParticipationModal({
  open,
  onOpenChange,
  exhibition,
  onSuccess,
}: ParticipationModalProps) {
  const [loading, setLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState<NFTItem[]>([]);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      fetchUserAssets();
    }
  }, [open]);

  const fetchUserAssets = async () => {
    try {
      // Fetch user's NFTs and collections
      const [nftsResponse, collectionsResponse] = await Promise.all([
        fetch("/api/user/nfts"),
        fetch("/api/user/collections"),
      ]);

      if (nftsResponse.ok) {
        const nftsData = await nftsResponse.json();
        setUserNFTs(nftsData.data || []);
      }

      if (collectionsResponse.ok) {
        const collectionsData = await collectionsResponse.json();
        setUserCollections(collectionsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching user assets:", error);
    }
  };

  const handleSubmit = async () => {
    if (selectedNFTs.length === 0 && selectedCollections.length === 0) {
      toast.error(
        "Please select at least one NFT or collection to participate with"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/exhibitions/${exhibition.id}/participate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nftItemIds: selectedNFTs,
            collectionIds: selectedCollections,
            message,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Participation request submitted successfully!");
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(result.error || "Failed to submit participation");
      }
    } catch (error) {
      console.error("Error submitting participation:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit participation"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedNFTs([]);
    setSelectedCollections([]);
    setMessage("");
    setSearchTerm("");
  };

  const toggleNFT = (nftId: string) => {
    setSelectedNFTs((prev) =>
      prev.includes(nftId)
        ? prev.filter((id) => id !== nftId)
        : [...prev, nftId]
    );
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const filteredNFTs = userNFTs.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCollections = userCollections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Participate in Exhibition</DialogTitle>
          <DialogDescription>
            Submit your NFTs and collections to participate in "
            {exhibition.title}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Items Summary */}
          {(selectedNFTs.length > 0 || selectedCollections.length > 0) && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Selected Items</h4>
              <div className="flex flex-wrap gap-2">
                {selectedNFTs.map((nftId) => {
                  const nft = userNFTs.find((n) => n.id === nftId);
                  return nft ? (
                    <Badge
                      key={nftId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <ImageIcon className="h-3 w-3" />
                      {nft.name}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => toggleNFT(nftId)}
                      />
                    </Badge>
                  ) : null;
                })}
                {selectedCollections.map((collectionId) => {
                  const collection = userCollections.find(
                    (c) => c.id === collectionId
                  );
                  return collection ? (
                    <Badge
                      key={collectionId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <ImageIcon className="h-3 w-3" />
                      {collection.name}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => toggleCollection(collectionId)}
                      />
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div>
            <Label htmlFor="search">Search Your Assets</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search NFTs and collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* NFTs Selection */}
          <div>
            <Label className="text-lg font-semibold">Your NFTs</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-60 overflow-y-auto">
              {filteredNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedNFTs.includes(nft.id)
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onClick={() => toggleNFT(nft.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      {selectedNFTs.includes(nft.id) && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{nft.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {nft.collection.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredNFTs.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-4">
                  No NFTs found
                </p>
              )}
            </div>
          </div>

          {/* Collections Selection */}
          <div>
            <Label className="text-lg font-semibold">Your Collections</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-h-60 overflow-y-auto">
              {filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedCollections.includes(collection.id)
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onClick={() => toggleCollection(collection.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      {selectedCollections.includes(collection.id) && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{collection.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {collection.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCollections.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-4">
                  No collections found
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message to Curator (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the exhibition curator about your submission..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                (selectedNFTs.length === 0 && selectedCollections.length === 0)
              }
            >
              {loading ? "Submitting..." : "Submit Participation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
