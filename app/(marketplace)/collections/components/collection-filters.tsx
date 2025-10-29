"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortAsc, Filter, Check, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SortOption {
  value: string;
  label: string;
  icon: any;
}

interface CategoryOption {
  value: string;
  label: string;
}

interface CollectionFiltersProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
  category: string;
  setCategory: (category: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  sortOptions: SortOption[];
  categoryOptions: CategoryOption[];
  currentSortLabel: string;
}

export function CollectionFilters({
  sortBy,
  setSortBy,
  category,
  setCategory,
  verifiedOnly,
  setVerifiedOnly,
  sortOptions,
  categoryOptions,
  currentSortLabel,
}: CollectionFiltersProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <>
      {/* Category Filter */}
      <DropdownMenu
        open={showCategoryDropdown}
        onOpenChange={setShowCategoryDropdown}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
          >
            <Filter className="h-4 w-4" />
            {category === "all"
              ? "All Categories"
              : categoryOptions.find((c) => c.value === category)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-slate-800 border-slate-700"
        >
          {categoryOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={`flex items-center justify-between ${
                category === option.value
                  ? "bg-slate-700 text-white"
                  : "text-slate-300"
              }`}
              onClick={() => {
                setCategory(option.value);
                setShowCategoryDropdown(false);
              }}
            >
              {option.label}
              {category === option.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
          >
            <SortAsc className="h-4 w-4" />
            {currentSortLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-slate-800 border-slate-700"
        >
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                className={`flex items-center gap-2 ${
                  sortBy === option.value
                    ? "bg-slate-700 text-white"
                    : "text-slate-300"
                }`}
                onClick={() => setSortBy(option.value)}
              >
                <Icon className="h-4 w-4" />
                {option.label}
                {sortBy === option.value && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Verified Filter */}
      <Button
        variant={verifiedOnly ? "default" : "outline"}
        size="sm"
        className={`gap-2 ${
          verifiedOnly
            ? "bg-blue-500 hover:bg-blue-600"
            : "border-slate-700 text-slate-300 hover:bg-slate-800"
        }`}
        onClick={() => setVerifiedOnly(!verifiedOnly)}
      >
        <Shield className="h-4 w-4" />
        Verified
        {verifiedOnly && (
          <Badge variant="secondary" className="ml-1 bg-white text-blue-600">
            ON
          </Badge>
        )}
      </Button>
    </>
  );
}
