import { z } from "zod";

// Get categories from the NFT categories data
export const EXHIBITION_CATEGORIES = [
  "gaming",
  "art",
  "photography",
  "3d",
  "animated",
  "collectibles",
  "music",
  "pfps",
  "sports",
  "fashion",
] as const;

export const exhibitionSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().max(1000, "Description too long").optional(),
    image: z.string().min(1, "Thumbnail image is required"),
    bannerImage: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    category: z.enum(EXHIBITION_CATEGORIES, {
      errorMap: () => ({ message: "Please select a valid category" }),
    }),
    tags: z.array(z.string()).default([]),
    locationType: z.enum(["virtual", "physical", "hybrid"]).default("virtual"),
    venueName: z.string().optional(),
    venueAddress: z.string().optional(),
    virtualUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    status: z.enum(["draft", "upcoming", "active", "ended"]).default("draft"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type ExhibitionFormData = z.infer<typeof exhibitionSchema>;

// Helper function to get category display name
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    gaming: "Gaming",
    art: "Digital Art",
    photography: "Photography",
    "3d": "3D Art",
    animated: "Animated",
    collectibles: "Collectibles",
    music: "Music",
    pfps: "PFPs",
    sports: "Sports",
    fashion: "Fashion",
  };
  return categoryMap[category] || category;
}
