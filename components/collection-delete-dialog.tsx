"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { collectionService } from "@/services/collection-service";
import { useUserCollections } from "@/hooks/use-user-collections";
import { Collection } from "@/lib/types";

interface DeleteCollectionDialogProps {
  collection: Collection;
  trigger?: React.ReactNode;
}

export function DeleteCollectionDialog({
  collection,
  trigger = (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  ),
}: DeleteCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetch } = useUserCollections();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await collectionService.deleteCollection(collection.id);

      if (response.success) {
        await refetch();
        setOpen(false);
      } else {
        setError(response.message || "Failed to delete collection");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      setError("An error occurred while deleting the collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Delete Collection
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the collection "{collection.name}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
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
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Delete Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
