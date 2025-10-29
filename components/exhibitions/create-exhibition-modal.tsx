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
import { Calendar, MapPin, Link } from "lucide-react";
import {
  exhibitionSchema,
  ExhibitionFormData,
  EXHIBITION_CATEGORIES,
  getCategoryDisplayName,
} from "@/lib/validations/exhibition";
import { toast } from "sonner";

interface CreateExhibitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateExhibitionModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateExhibitionModalProps) {
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
    defaultValues: {
      locationType: "virtual",
      status: "draft",
      tags: [],
    },
  });

  const locationType = watch("locationType");

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: ExhibitionFormData) => {
    try {
      const response = await fetch("/api/exhibitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Exhibition created successfully.");
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(result.message || "Failed to create exhibition");
      }
    } catch (error) {
      console.error("Error creating exhibition:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create exhibition"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exhibition</DialogTitle>
          <DialogDescription>
            Create a new exhibition to showcase your NFT collections and
            artworks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Exhibition Title *</Label>
                <Input
                  id="title"
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
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
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
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
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
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
                  <Label htmlFor="category">Category *</Label>
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

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(value: ExhibitionFormData["status"]) =>
                      setValue("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Label htmlFor="locationType">Location Type</Label>
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
                    <Label htmlFor="venueName">Venue Name</Label>
                    <Input
                      id="venueName"
                      {...register("venueName")}
                      placeholder="Enter venue name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="venueAddress">Venue Address</Label>
                    <Textarea
                      id="venueAddress"
                      {...register("venueAddress")}
                      placeholder="Enter venue address"
                      rows={2}
                    />
                  </div>
                </>
              )}

              {locationType !== "physical" && (
                <div>
                  <Label htmlFor="virtualUrl">Virtual URL</Label>
                  <Input
                    id="virtualUrl"
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
              {isSubmitting ? "Creating..." : "Create Exhibition"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
