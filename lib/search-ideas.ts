import { ideas } from "@/lib/ideas-data"
import type { ContentTypeFilter, SearchIdea } from "@/types/search"

export interface IdeaSearchInput {
  query?: string
  category?: string
  tags?: string[]
  contentType?: ContentTypeFilter
  authors?: string[]
  dateFrom?: Date
  dateTo?: Date
  voteMin?: number
  voteMax?: number
  sortBy?: "relevance" | "newest" | "votes"
}

function includes(value: string, query: string) {
  return value.toLocaleLowerCase().includes(query)
}

function relevanceScore(idea: SearchIdea, normalizedQuery: string) {
  if (!normalizedQuery) return 0

  let score = 0
  if (includes(idea.title, normalizedQuery)) score += 8
  if (includes(idea.excerpt, normalizedQuery)) score += 4
  if (includes(idea.category, normalizedQuery)) score += 3
  if (includes(idea.author, normalizedQuery)) score += 2
  score += idea.tags.filter((tag) => includes(tag, normalizedQuery)).length * 3

  for (const term of normalizedQuery.split(/\s+/).filter(Boolean)) {
    if (includes(idea.title, term)) score += 3
    if (includes(idea.excerpt, term)) score += 1
  }
  return score
}

export function searchIdeas(input: IdeaSearchInput): SearchIdea[] {
  const query = input.query?.trim().toLocaleLowerCase() ?? ""
  const selectedTags = (input.tags ?? []).map((tag) => tag.toLocaleLowerCase())
  const selectedAuthors = (input.authors ?? []).map((author) => author.toLocaleLowerCase())

  const results = ideas
    .map((idea) => ({ ...idea, relevance: relevanceScore(idea, query) }))
    .filter((idea) => !query || (idea.relevance ?? 0) > 0)
    .filter(
      (idea) =>
        !input.category ||
        idea.category.toLocaleLowerCase() === input.category.toLocaleLowerCase(),
    )
    .filter((idea) => {
      if (selectedTags.length === 0) return true
      const ideaTags = idea.tags.map((tag) => tag.toLocaleLowerCase())
      return selectedTags.every((tag) => ideaTags.includes(tag))
    })
    .filter((idea) => {
      if (!input.contentType || input.contentType === "all") return true
      return input.contentType === "premium" ? idea.premium : !idea.premium
    })
    .filter(
      (idea) =>
        selectedAuthors.length === 0 ||
        selectedAuthors.includes(idea.author.toLocaleLowerCase()),
    )
    .filter((idea) => {
      const publishedAt = new Date(idea.publishedAt)
      if (input.dateFrom && publishedAt < input.dateFrom) return false
      if (input.dateTo && publishedAt > input.dateTo) return false
      return true
    })
    .filter((idea) => input.voteMin === undefined || idea.votes >= input.voteMin)
    .filter((idea) => input.voteMax === undefined || idea.votes <= input.voteMax)

  const sortBy = input.sortBy ?? (query ? "relevance" : "newest")
  return results.sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes
    if (sortBy === "newest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    return (b.relevance ?? 0) - (a.relevance ?? 0) || b.votes - a.votes
  })
}
