export type ContentTypeFilter = "all" | "premium" | "free"

export interface DateRangeFilter {
  from: Date
  to: Date
}

export interface VoteRangeFilter {
  min: number
  max: number
}

export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  contentType?: ContentTypeFilter
  authors?: string[]
  sortBy?: "relevance" | "newest" | "votes"
  dateRange?: DateRangeFilter
  voteRange?: VoteRangeFilter
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: Date
}

export interface SearchIdea {
  id: number
  title: string
  excerpt: string
  author: string
  publishedAt: string
  votes: number
  category: string
  tags: string[]
  premium: boolean
  relevance?: number
}

export interface SearchResponse {
  items: SearchIdea[]
  total: number
  elapsedMs: number
}
