"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import {
  exhibitionSchema,
  ExhibitionFormData,
  EXHIBITION_CATEGORIES,
  getCategoryDisplayName,
} from "@/lib/validations/exhibition";
import { toast } from "sonner";

interface EditExhibitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibition: any;
  onSuccess: () => void;
}

export default function EditExhibitionModal({
  open,
  onOpenChange,
  exhibition,
  onSuccess,
}: EditExhibitionModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExhibitionFormData>({
    resolver: zodResolver(exhibitionSchema),
  });

  const locationType = watch("locationType");

  useEffect(() => {
    if (exhibition && open) {
      const formatDateForInput = (dateString: string) => {
        return new Date(dateString).toISOString().slice(0, 16);
      };

      reset({
        title: exhibition.title || "",
        description: exhibition.description || "",
        image: exhibition.image || "",
        bannerImage: exhibition.bannerImage || "",
        startDate: exhibition.startDate
          ? formatDateForInput(exhibition.startDate)
          : "",
        endDate: exhibition.endDate
          ? formatDateForInput(exhibition.endDate)
          : "",
        category: exhibition.category || "",
        status: exhibition.status || "draft",
        locationType: exhibition.locationType || "virtual",
        venueName: exhibition.venueName || "",
        venueAddress: exhibition.venueAddress || "",
        virtualUrl: exhibition.virtualUrl || "",
        tags: exhibition.tags || [],
      });
    }
  }, [exhibition, open, reset]);

  const onSubmit = async (data: ExhibitionFormData) => {
    if (!exhibition) return;

    try {
      const response = await fetch(`/api/exhibitions/${exhibition.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Exhibition updated successfully.");
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(result.message || "Failed to update exhibition");
      }
    } catch (error) {
      console.error("Error updating exhibition:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update exhibition"
      );
    }
  };

  if (!exhibition) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exhibition</DialogTitle>
          <DialogDescription>
            Update your exhibition details and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-title">Exhibition Title</Label>
                <Input
                  id="edit-title"
                  {...register("title")}
                  placeholder="Enter exhibition title"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  {...register("description")}
                  placeholder="Describe your exhibition..."
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="datetime-local"
                    {...register("startDate")}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="datetime-local"
                    {...register("endDate")}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(
                      value: "draft" | "upcoming" | "active" | "ended"
                    ) => setValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(value: ExhibitionFormData["category"]) =>
                      setValue("category", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXHIBITION_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryDisplayName(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Images</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CloudinaryUpload
                value={watch("image")}
                onChange={(value) => setValue("image", value)}
                onRemove={() => setValue("image", "")}
                disabled={isSubmitting}
                type="thumbnail"
              />

              <CloudinaryUpload
                value={watch("bannerImage") || ""}
                onChange={(value) => setValue("bannerImage", value)}
                onRemove={() => setValue("bannerImage", "")}
                disabled={isSubmitting}
                type="banner"
              />
            </div>

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-locationType">Location Type</Label>
                <Select
                  value={locationType}
                  onValueChange={(value: "virtual" | "physical" | "hybrid") =>
                    setValue("locationType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {locationType !== "virtual" && (
                <>
                  <div>
                    <Label htmlFor="edit-venueName">Venue Name</Label>
                    <Input
                      id="edit-venueName"
                      {...register("venueName")}
                      placeholder="Enter venue name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-venueAddress">Venue Address</Label>
                    <Textarea
                      id="edit-venueAddress"
                      {...register("venueAddress")}
                      placeholder="Enter venue address"
                      rows={2}
                    />
                  </div>
                </>
              )}

              {locationType !== "physical" && (
                <div>
                  <Label htmlFor="edit-virtualUrl">Virtual URL</Label>
                  <Input
                    id="edit-virtualUrl"
                    {...register("virtualUrl")}
                    placeholder="https://..."
                    type="url"
                    className={errors.virtualUrl ? "border-red-500" : ""}
                  />
                  {errors.virtualUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.virtualUrl.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Stats</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <p className="text-xl font-bold">{exhibition.views}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Likes</p>
                <p className="text-xl font-bold">{exhibition.likes}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collections</p>
                <p className="text-xl font-bold">
                  {exhibition._count?.collections || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NFTs</p>
                <p className="text-xl font-bold">
                  {exhibition._count?.nfts || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Exhibition"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
