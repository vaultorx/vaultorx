"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCollections } from "@/hooks/use-collections";
import { useUserCollections } from "@/hooks/use-user-collections";

interface Attribute {
  trait_type: string;
  value: string;
}

interface MintDetailsStepProps {
  name: string;
  description: string;
  attributes: Attribute[];
  collectionId: string;
  category: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onAttributesChange: (attributes: Attribute[]) => void;
  onCollectionChange: (collectionId: string) => void;
  onCategoryChange: (category: string) => void;
  onRarityChange: (rarity: "Common" | "Rare" | "Epic" | "Legendary") => void;
}

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

export function MintDetailsStep({
  name,
  description,
  attributes,
  collectionId,
  category,
  rarity,
  onNameChange,
  onDescriptionChange,
  onAttributesChange,
  onCollectionChange,
  onCategoryChange,
  onRarityChange,
}: MintDetailsStepProps) {
  const { collections, loading, error } = useUserCollections();
  const addAttribute = () => {
    onAttributesChange([...attributes, { trait_type: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    onAttributesChange(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: "trait_type" | "value",
    value: string
  ) => {
    const updated = [...attributes];
    updated[index][field] = value;
    onAttributesChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">NFT Details</h2>
        <p className="text-muted-foreground">
          Provide information about your NFT
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nft-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nft-name"
              placeholder="e.g. Ethereal Dreams #1"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nft-description">Description</Label>
            <Textarea
              id="nft-description"
              placeholder="Describe your NFT in detail..."
              rows={4}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The description will be included in the NFT's metadata and
              displayed on the detail page.
            </p>
          </div>

          {/* Collection Selection */}
          <div className="space-y-2">
            <Label htmlFor="collection">
              Collection <span className="text-destructive">*</span>
            </Label>
            <Select
              value={collectionId}
              onValueChange={onCollectionChange}
              disabled={loading}
            >
              <SelectTrigger>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading collections...
                  </div>
                ) : (
                  <SelectValue placeholder="Select a collection" />
                )}
              </SelectTrigger>
              <SelectContent>
                {error ? (
                  <div className="p-2 text-center text-sm text-red-400">
                    Failed to load collections
                  </div>
                ) : collections.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No collections found
                  </div>
                ) : (
                  collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      <div className="flex items-center gap-2">
                        {collection.image && (
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-4 h-4 rounded object-cover"
                          />
                        )}
                        <span>{collection.name}</span>
                        {collection.verified && (
                          <span className="text-blue-400">✓</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-400">
                Error loading collections. Please try again.
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rarity Selection */}
          <div className="space-y-2">
            <Label>
              Rarity <span className="text-destructive">*</span>
            </Label>
            <RadioGroup value={rarity} onValueChange={onRarityChange}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="Common" id="common" />
                  <Label htmlFor="common" className="cursor-pointer">
                    Common
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="Rare" id="rare" />
                  <Label htmlFor="rare" className="cursor-pointer">
                    Rare
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="Epic" id="epic" />
                  <Label htmlFor="epic" className="cursor-pointer">
                    Epic
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="Legendary" id="legendary" />
                  <Label htmlFor="legendary" className="cursor-pointer">
                    Legendary
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Attributes (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttribute}
                className="gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Attribute
              </Button>
            </div>

            {attributes.length > 0 && (
              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Trait type (e.g. Background)"
                      value={attr.trait_type}
                      onChange={(e) =>
                        updateAttribute(index, "trait_type", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value (e.g. Blue)"
                      value={attr.value}
                      onChange={(e) =>
                        updateAttribute(index, "value", e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttribute(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
