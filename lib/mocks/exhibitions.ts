import { Exhibition, VisitorAnalytics } from "@/lib/types";

export const exhibitions: Exhibition[] = [
  {
    id: "ex1",
    title: "Digital Renaissance",
    description:
      "Exploring the intersection of classical art and digital technology",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    location: "Virtual Gallery",
    visitors: 12450,
    featuredNFTs: 15,
    totalNFTs: 45,
    curator: "Your Profile",
    image: "/placeholder.svg",
  },
  {
    id: "ex2",
    title: "Metaverse Art Week",
    description: "A showcase of groundbreaking metaverse-native artworks",
    status: "upcoming",
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    location: "Decentraland & Spatial",
    visitors: 0,
    featuredNFTs: 8,
    totalNFTs: 25,
    curator: "Your Profile",
    image: "/placeholder.svg",
  },
  {
    id: "ex3",
    title: "Generative Art Symposium",
    description: "Celebrating the art of code and algorithmic creativity",
    status: "ended",
    startDate: "2024-01-10",
    endDate: "2024-01-25",
    location: "Online Exhibition",
    visitors: 8560,
    featuredNFTs: 12,
    totalNFTs: 30,
    curator: "Your Profile",
    image: "/placeholder.svg",
  },
];

export const visitorAnalytics: VisitorAnalytics[] = [
  { date: "2024-01-01", visitors: 450, pageViews: 1200, duration: 3.2 },
  { date: "2024-01-02", visitors: 520, pageViews: 1450, duration: 3.5 },
  { date: "2024-01-03", visitors: 480, pageViews: 1350, duration: 3.1 },
  { date: "2024-01-04", visitors: 610, pageViews: 1680, duration: 3.8 },
];
