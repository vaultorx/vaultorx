"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteExhibitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibition: any;
  onSuccess: () => void;
}

export default function DeleteExhibitionModal({
  open,
  onOpenChange,
  exhibition,
  onSuccess,
}: DeleteExhibitionModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!exhibition) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/exhibitions/${exhibition.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        console.error("Failed to delete exhibition:", data.message);
      }
    } catch (error) {
      console.error("Error deleting exhibition:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!exhibition) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Exhibition
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            exhibition and remove all associated data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">
              {exhibition.title}
            </h4>
            <p className="text-sm text-red-700">
              Status: <span className="capitalize">{exhibition.status}</span>
            </p>
            <p className="text-sm text-red-700">
              {exhibition._count?.collections || 0} collections •{" "}
              {exhibition._count?.nfts || 0} NFTs
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Exhibition"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
