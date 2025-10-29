"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Edit, Upload } from "lucide-react";
import { collectionService } from "@/services/collection-service";
import { useUserCollections } from "@/hooks/use-user-collections";
import { Collection } from "@/lib/types";

const collectionFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  royaltyPercentage: z.number().min(0).max(20),
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File).optional(),
});

type CollectionFormData = z.infer<typeof collectionFormSchema>;

const CATEGORIES = [
  "art",
  "gaming",
  "photography",
  "3d",
  "animated",
  "collectibles",
  "music",
  "pfps",
  "sports",
  "fashion",
];

interface EditCollectionDialogProps {
  collection: Collection;
  trigger?: React.ReactNode;
}

export function EditCollectionDialog({
  collection,
  trigger = (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ),
}: EditCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    collection.image || null
  );
  const { refetch } = useUserCollections();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: collection.name,
      description: collection.description || "",
      royaltyPercentage: collection.royaltyPercentage,
      category: collection.category || "art",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: collection.name,
        description: collection.description || "",
        royaltyPercentage: collection.royaltyPercentage,
        category: collection.category || "art",
      });
      setPreview(collection.image || null);
    }
  }, [open, collection, form]);

  const onSubmit = async (data: CollectionFormData) => {
    setLoading(true);
    try {
      const response = await collectionService.updateCollection(
        collection.id,
        data
      );

      if (response.success) {
        await refetch();
        setOpen(false);
      } else {
        throw new Error(response.message || "Failed to update collection");
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file, { shouldValidate: true });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Collection Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="collection-image-edit"
                          onChange={handleImageChange}
                          {...field}
                        />
                        <label
                          htmlFor="collection-image-edit"
                          className="cursor-pointer"
                        >
                          {preview ? (
                            <div className="aspect-square max-w-48 mx-auto rounded-lg overflow-hidden">
                              <img
                                src={preview}
                                alt="Collection preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                              <p className="text-sm font-medium">
                                Change Collection Image
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Collection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your collection..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Royalty */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="royaltyPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Royalty: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={20}
                        step={0.5}
                        className="py-2"
                      />
                    </FormControl>
                    <FormDescription>
                      Earn {field.value}% when your NFTs are resold
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Update Collection
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
