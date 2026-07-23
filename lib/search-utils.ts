import type { ContentTypeFilter, SearchFilters } from "@/types/search"

export function buildSearchQuery(filters: SearchFilters): Record<string, string> {
  const query: Record<string, string> = {}

  if (filters.query?.trim()) query.q = filters.query.trim()
  if (filters.category) query.category = filters.category
  if (filters.tags?.length) query.tags = filters.tags.join(",")
  if (filters.contentType && filters.contentType !== "all") {
    query.contentType = filters.contentType
  }
  if (filters.sortBy) query.sortBy = filters.sortBy

  if (filters.dateRange?.from) {
    query.dateFrom = filters.dateRange.from.toISOString()
  }
  if (filters.dateRange?.to) {
    query.dateTo = filters.dateRange.to.toISOString()
  }
  if (filters.voteRange?.min !== undefined) {
    query.voteMin = String(filters.voteRange.min)
  }
  if (filters.voteRange?.max !== undefined) {
    query.voteMax = String(filters.voteRange.max)
  }
  if (filters.authors?.length) query.authors = filters.authors.join(",")

  return query
}

interface SearchParamReader {
  get(name: string): string | null
}

export function parseSearchQuery(searchParams: SearchParamReader): SearchFilters {
  const filters: SearchFilters = {}

  const query = searchParams.get("q")
  if (query) filters.query = query

  const category = searchParams.get("category")
  if (category) filters.category = category

  const tags = searchParams.get("tags")
  if (tags) filters.tags = tags.split(",").filter(Boolean)

  const rawContentType = searchParams.get("contentType")
  if (["all", "premium", "free"].includes(rawContentType ?? "")) {
    filters.contentType = rawContentType as ContentTypeFilter
  }

  const rawSortBy = searchParams.get("sortBy")
  if (["relevance", "newest", "votes"].includes(rawSortBy ?? "")) {
    filters.sortBy = rawSortBy as SearchFilters["sortBy"]
  }

  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")
  if (dateFrom || dateTo) {
    filters.dateRange = {
      from: dateFrom ? new Date(dateFrom) : new Date(0),
      to: dateTo ? new Date(dateTo) : new Date(),
    }
  }

  const voteMin = searchParams.get("voteMin")
  const voteMax = searchParams.get("voteMax")
  if (voteMin || voteMax) {
    filters.voteRange = {
      min: voteMin ? Number.parseInt(voteMin, 10) : 0,
      max: voteMax ? Number.parseInt(voteMax, 10) : 1000,
    }
  }

  const authors = searchParams.get("authors")
  if (authors) filters.authors = authors.split(",").filter(Boolean)

  return filters
}

export function filtersToUrlParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(buildSearchQuery(filters)).forEach(([key, value]) => {
    params.set(key, value)
  })
  return params
}

export const QUICK_FILTERS: Array<{
  name: string
  filters: Partial<SearchFilters>
}> = [
  {
    name: "Recent",
    filters: {
      dateRange: {
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
      sortBy: "newest",
    },
  },
  {
    name: "Popular",
    filters: { voteRange: { min: 50, max: 1000 }, sortBy: "votes" },
  },
  {
    name: "This Month",
    filters: {
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  },
  {
    name: "Premium",
    filters: { contentType: "premium" },
  },
]
