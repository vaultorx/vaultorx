"use client";

import { cn } from "@/lib/utils";

import type React from "react";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage, FileVideo, FileAudio } from "lucide-react";
import Image from "next/image";

interface MintUploadStepProps {
  // allow clearing the selected file by accepting null
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export function MintUploadStep({
  onFileSelect,
  selectedFile,
}: MintUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFile = (file: File) => {
    onFileSelect(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    onFileSelect(null);
    setPreview(null);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-8 w-8" />;
    if (type.startsWith("video/")) return <FileVideo className="h-8 w-8" />;
    if (type.startsWith("audio/")) return <FileAudio className="h-8 w-8" />;
    return <Upload className="h-8 w-8" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload Your Asset</h2>
        <p className="text-muted-foreground">
          File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV. Max
          size: 100 MB
        </p>
      </div>

      {!selectedFile ? (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            dragActive ? "border-primary bg-primary/5" : "border-muted"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">
              Drag and drop your file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <label htmlFor="file-upload">
              <Button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={handleChange}
              />
            </label>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {preview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {getFileIcon(selectedFile.type)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    IPFS Upload Status
                  </p>
                  <p className="text-sm font-medium text-primary">
                    Ready to upload
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
