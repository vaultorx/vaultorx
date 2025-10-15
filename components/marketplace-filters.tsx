"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CATEGORIES, SUPPORTED_BLOCKCHAINS, SUPPORTED_CURRENCIES } from "@/lib/constants"
import { X } from "lucide-react"

interface MarketplaceFiltersProps {
  onFilterChange?: (filters: any) => void
}

export function MarketplaceFilters({ onFilterChange }: MarketplaceFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBlockchains, setSelectedBlockchains] = useState<string[]>([])
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
  const [listingStatus, setListingStatus] = useState<string[]>([])

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleBlockchainToggle = (blockchainId: string) => {
    setSelectedBlockchains((prev) =>
      prev.includes(blockchainId) ? prev.filter((id) => id !== blockchainId) : [...prev, blockchainId],
    )
  }

  const handleCurrencyToggle = (currencyId: string) => {
    setSelectedCurrencies((prev) =>
      prev.includes(currencyId) ? prev.filter((id) => id !== currencyId) : [...prev, currencyId],
    )
  }

  const handleStatusToggle = (status: string) => {
    setListingStatus((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearAllFilters = () => {
    setPriceRange([0, 100])
    setSelectedCategories([])
    setSelectedBlockchains([])
    setSelectedCurrencies([])
    setListingStatus([])
  }

  const activeFilterCount =
    selectedCategories.length + selectedBlockchains.length + selectedCurrencies.length + listingStatus.length

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["status", "price", "categories", "blockchain"]} className="w-full">
        {/* Listing Status */}
        <AccordionItem value="status">
          <AccordionTrigger className="text-sm font-medium">Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {["Buy Now", "On Auction", "New", "Has Offers"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={listingStatus.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label htmlFor={status} className="text-sm font-normal cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" value={priceRange[0]} className="h-9" />
                <span className="text-muted-foreground">to</span>
                <Input type="number" placeholder="Max" value={priceRange[1]} className="h-9" />
              </div>
              <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={1} className="w-full" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{priceRange[0]} ETH</span>
                <span>{priceRange[1]} ETH</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {CATEGORIES.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Blockchain */}
        <AccordionItem value="blockchain">
          <AccordionTrigger className="text-sm font-medium">Blockchain</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
                <div key={blockchain.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={blockchain.id}
                    checked={selectedBlockchains.includes(blockchain.id)}
                    onCheckedChange={() => handleBlockchainToggle(blockchain.id)}
                  />
                  <Label htmlFor={blockchain.id} className="text-sm font-normal cursor-pointer">
                    {blockchain.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Currency */}
        <AccordionItem value="currency">
          <AccordionTrigger className="text-sm font-medium">Currency</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {SUPPORTED_CURRENCIES.map((currency) => (
                <div key={currency.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={currency.id}
                    checked={selectedCurrencies.includes(currency.id)}
                    onCheckedChange={() => handleCurrencyToggle(currency.id)}
                  />
                  <Label htmlFor={currency.id} className="text-sm font-normal cursor-pointer">
                    {currency.name} ({currency.symbol})
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={() => onFilterChange?.({})}>
        Apply Filters
      </Button>
    </div>
  )
}
