import { ExhibitionGallery } from "@/components/exhibitions/exhibition-gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFT Exhibitions - Explore Digital Art Galleries",
  description:
    "Discover and explore amazing NFT exhibitions featuring digital art, collectibles, and unique blockchain artworks.",
};

export default function ExhibitionsPage() {
  return <ExhibitionGallery />;
}
