"use client"

import { useState } from "react"
import { ChevronDown, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { IDEA_CATEGORIES, IDEA_TAGS } from "@/lib/ideas-data"
import { useSearchFilters } from "@/hooks/use-search-filters"

export function IdeasFilter({ onApply }) {
  const [openCategories, setOpenCategories] = useState(true)
  const [openTags, setOpenTags] = useState(true)
  const { filters, updateFilters, clearFilters } = useSearchFilters()

  const toggleTag = (tag, checked) => {
    const current = filters.tags ?? []
    const tags = checked
      ? Array.from(new Set([...current, tag]))
      : current.filter((item) => item !== tag)
    updateFilters({ tags })
  }

  const setContentType = (contentType) => {
    updateFilters({ contentType: contentType === "all" ? undefined : contentType })
  }

  const hasFilters = Boolean(
    filters.category || filters.tags?.length || filters.contentType,
  )

  return (
    <Card className="sticky top-6">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Filters</CardTitle>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearFilters()
              onApply?.()
            }}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Collapsible open={openCategories} onOpenChange={setOpenCategories}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
              Categories
              <ChevronDown className={`h-4 w-4 transition-transform ${openCategories ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-4 pt-2">
            {IDEA_CATEGORIES.map((category) => {
              const id = `category-${category.toLowerCase().replace(/\s+/g, "-")}`
              return (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={filters.category === category}
                    onCheckedChange={(checked) =>
                      updateFilters({ category: checked ? category : undefined })
                    }
                  />
                  <Label htmlFor={id}>{category}</Label>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible open={openTags} onOpenChange={setOpenTags}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-0 font-semibold">
              Tags
              <ChevronDown className={`h-4 w-4 transition-transform ${openTags ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pb-4 pt-2">
            {IDEA_TAGS.map((tag) => {
              const id = `tag-${tag.toLowerCase().replace(/\s+/g, "-")}`
              return (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={filters.tags?.includes(tag) ?? false}
                    onCheckedChange={(checked) => toggleTag(tag, Boolean(checked))}
                  />
                  <Label htmlFor={id}>{tag}</Label>
                </div>
              )
            })}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-semibold">Content Type</h3>
          {[
            ["all", "All Content"],
            ["premium", "Premium Only"],
            ["free", "Free Only"],
          ].map(([value, label]) => {
            const selected = (filters.contentType ?? "all") === value
            return (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`content-${value}`}
                  checked={selected}
                  onCheckedChange={(checked) => checked && setContentType(value)}
                />
                <Label htmlFor={`content-${value}`}>{label}</Label>
              </div>
            )
          })}
        </div>

        <Separator />

        <Button className="w-full" onClick={() => onApply?.()}>
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  )
}
