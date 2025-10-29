"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudinaryUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  type?: "thumbnail" | "banner";
}

export function CloudinaryUpload({
  value,
  onChange,
  onRemove,
  disabled,
  type = "thumbnail",
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF)");
        return;
      }

      if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
      }

      uploadToCloudinary(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadToCloudinary(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const aspectRatio = type === "banner" ? "aspect-video" : "aspect-square";

  return (
    <div className="space-y-2">
      <Label>
        {type === "thumbnail" ? "Thumbnail Image" : "Banner Image"}
        {type === "thumbnail" && " *"}
      </Label>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className={cn(
              "w-full object-cover rounded-lg border-2 border-muted-foreground/25",
              aspectRatio
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed border-muted-foreground/25 rounded-lg transition-colors hover:border-muted-foreground/50",
            aspectRatio,
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label
            htmlFor={`file-upload-${type}`}
            className={cn(
              "flex flex-col items-center justify-center h-full cursor-pointer",
              disabled && "cursor-not-allowed"
            )}
          >
            <div className="space-y-2 text-center">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Uploading...
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p>PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={disabled}
                  >
                    Select Image
                  </Button>
                </>
              )}
            </div>
            <Input
              id={`file-upload-${type}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
