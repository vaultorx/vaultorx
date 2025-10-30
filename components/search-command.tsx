"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  User,
  Image,
  TrendingUp,
  Layers,
  GalleryHorizontal,
  AlertCircle,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";

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
  const { results, loading, error, search, clearResults } = useSearch();

  // Debounced search effect
  React.useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery);
      } else {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, open, search, clearResults]);

  // Clear results when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
      clearResults();
    }
  }, [open, clearResults]);

  React.useEffect(() => {
    console.log(results);
  }, [results]);

  const handleSelect = (type: string, id: string) => {
    switch (type) {
      case "collection":
        router.push(`/collections/${id}`);
        break;
      case "nft":
        router.push(`/nft/${id}`);
        break;
      case "exhibition":
        router.push(`/exhibitions/${id}`);
        break;
      case "user":
        router.push(`/profile/${id}`);
        break;
      default:
        router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
    onOpenChange(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
      onOpenChange(false);
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

  const formatPrice = (price: number) => {
    return `${price?.toFixed(2) || "0.00"} ETH`;
  };

  const hasResults =
    results &&
    (results.collections.length > 0 ||
      results.nfts.length > 0 ||
      results.users.length > 0 ||
      results.exhibitions.length > 0);

  const totalResults = results
    ? results.collections.length +
      results.nfts.length +
      results.users.length +
      results.exhibitions.length
    : 0;

  return (
    <CommandDialog className="bg-white" open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search collections, NFTs, creators, exhibitions..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Searching...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Search failed. Please try again.</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && searchQuery && hasResults && (
          <>
            {/* Collections Results */}
            {Array.isArray(results?.collections) &&
              results.collections.length > 0 && (
                <CommandGroup heading="Collections">
                  {results.collections.map((collection) => (
                    <CommandItem
                      key={collection.id}
                      onSelect={() => handleSelect("collection", collection.id)}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0">
                        {collection.image ? (
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Layers className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {collection.name}
                          </span>
                          {collection.verified && (
                            <span className="text-blue-600 text-xs">✓</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {collection._count?.nfts || 0} items •{" "}
                          {formatPrice(collection.totalVolume || 0)} volume
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

            {/* NFTs Results */}
            {Array.isArray(results?.nfts) && results.nfts.length > 0 && (
              <CommandGroup heading="NFTs">
                {results.nfts.map((nft) => (
                  <CommandItem
                    key={nft.id}
                    onSelect={() => handleSelect("nft", nft.id)}
                    className="flex items-center gap-3"
                  >
                    <div className="shrink-0">
                      <img
                        src={nft.image || "/placeholder-nft.png"}
                        alt={nft.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {nft.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {nft.collection?.name} •{" "}
                        {nft.listPrice
                          ? formatPrice(nft.listPrice)
                          : "Not listed"}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Users Results */}
            {Array.isArray(results?.users) && results.users.length > 0 && (
              <CommandGroup heading="Creators">
                {results.users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelect("user", user.id)}
                    className="flex items-center gap-3"
                  >
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {user.username || user.name || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-600">Creator</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Exhibitions Results */}
            {Array.isArray(results?.exhibitions) &&
              results.exhibitions.length > 0 && (
                <CommandGroup heading="Exhibitions">
                  {results.exhibitions.map((exhibition) => (
                    <CommandItem
                      key={exhibition.id}
                      onSelect={() => handleSelect("exhibition", exhibition.id)}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0">
                        {exhibition.image ? (
                          <img
                            src={exhibition.image}
                            alt={exhibition.title}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                            <GalleryHorizontal className="h-4 w-4 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {exhibition.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {exhibition._count?.nfts || 0} artworks •{" "}
                          {exhibition.views} views
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

            {/* Search All Results */}
            <CommandGroup>
              <CommandItem onSelect={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                <span>
                  View all {totalResults} results for "{searchQuery}"
                </span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* No Results State */}
        {!loading && !error && searchQuery && !hasResults && (
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium mb-2">
                No results found for "{searchQuery}"
              </p>
              <p className="text-gray-500 text-sm">
                Try searching with different keywords or browse our suggestions
              </p>
            </div>
          </CommandEmpty>
        )}

        {/* Initial State - Show when no search query */}
        {!searchQuery && !loading && !error && (
          <>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  Search Collections, NFTs & More
                </p>
                <p className="text-gray-500 text-sm">
                  Type to discover amazing digital assets and creators
                </p>
              </div>
            </CommandEmpty>

            {/* Quick Suggestions */}
            {filteredSuggestions.length > 0 && (
              <CommandGroup heading="Quick Search">
                {filteredSuggestions.map((suggestion) => {
                  const Icon = suggestion.icon;
                  return (
                    <CommandItem
                      key={suggestion.name}
                      onSelect={() => {
                        setSearchQuery(suggestion.name);
                      }}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{suggestion.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
