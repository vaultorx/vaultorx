"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, User, Image, TrendingUp } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const searchSuggestions = [
  {
    name: "Trending Collections",
    category: "Collections",
    icon: TrendingUp,
    keywords: ["trending", "popular", "hot"],
  },
  {
    name: "Recent Drops",
    category: "Collections",
    icon: Calendar,
    keywords: ["recent", "new", "drops"],
  },
  {
    name: "Profile Pictures",
    category: "Categories",
    icon: User,
    keywords: ["pfp", "profile", "avatar"],
  },
  {
    name: "Digital Art",
    category: "Categories",
    icon: Image,
    keywords: ["art", "digital", "creative"],
  },
];

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelect = (suggestion: (typeof searchSuggestions)[0]) => {
    const query = suggestion.name.toLowerCase();
    router.push(`/marketplace?search=${encodeURIComponent(query)}`);
    onOpenChange(false);
    setSearchQuery("");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  // Filter suggestions based on search query
  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(
        (suggestion) =>
          suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suggestion.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : searchSuggestions;

  return (
    <CommandDialog className="bg-slate-100" open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search collections, NFTs, creators..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Search Results Group */}
        {searchQuery && (
          <CommandGroup heading="Search">
            <CommandItem onSelect={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search for "{searchQuery}"</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Suggestions Grouped by Category */}
        {!searchQuery || filteredSuggestions.length > 0
          ? Object.entries(
              filteredSuggestions.reduce((acc, suggestion) => {
                if (!acc[suggestion.category]) {
                  acc[suggestion.category] = [];
                }
                acc[suggestion.category].push(suggestion);
                return acc;
              }, {} as Record<string, typeof searchSuggestions>)
            ).map(([category, suggestions]) => (
              <CommandGroup key={category} heading={category}>
                {suggestions.map((suggestion) => {
                  const Icon = suggestion.icon;
                  return (
                    <CommandItem
                      key={suggestion.name}
                      onSelect={() => handleSelect(suggestion)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{suggestion.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))
          : null}
      </CommandList>
    </CommandDialog>
  );
}
