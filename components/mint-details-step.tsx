"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface Attribute {
  trait_type: string
  value: string
}

interface MintDetailsStepProps {
  name: string
  description: string
  attributes: Attribute[]
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onAttributesChange: (attributes: Attribute[]) => void
}

export function MintDetailsStep({
  name,
  description,
  attributes,
  onNameChange,
  onDescriptionChange,
  onAttributesChange,
}: MintDetailsStepProps) {
  const addAttribute = () => {
    onAttributesChange([...attributes, { trait_type: "", value: "" }])
  }

  const removeAttribute = (index: number) => {
    onAttributesChange(attributes.filter((_, i) => i !== index))
  }

  const updateAttribute = (index: number, field: "trait_type" | "value", value: string) => {
    const updated = [...attributes]
    updated[index][field] = value
    onAttributesChange(updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">NFT Details</h2>
        <p className="text-muted-foreground">Provide information about your NFT</p>
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
              The description will be included in the NFT's metadata and displayed on the detail page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Attributes (Optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAttribute} className="gap-2 bg-transparent">
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
                      onChange={(e) => updateAttribute(index, "trait_type", e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g. Blue)"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, "value", e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeAttribute(index)}>
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
  )
}
