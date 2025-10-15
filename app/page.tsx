import { Header } from "@/components/header"
import { CategoryNav } from "@/components/category-nav"
import { HeroSection } from "@/components/hero-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { TrendingNFTs } from "@/components/trending-nfts"
import { HomeFooter } from "@/components/home-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedCollections />
      <TrendingNFTs />
      <HomeFooter />
    </div>
  )
}
