"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Grid,
  List,
  Filter,
  SortAsc,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { NFTItem } from "@/lib/types";
import { CompactNFTCard } from "@/components/compact-card";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import MarketplaceClient from "./component/markeplace-client";
import { HomeFooter } from "@/components/home-footer";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Listed" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-viewed", label: "Most Viewed" },
  { value: "rare", label: "Rarity" },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <MarketplaceClient />
      <HomeFooter />
    </div>
  );
}
