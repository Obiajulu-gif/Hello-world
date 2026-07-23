import { NextRequest, NextResponse } from "next/server"
import { searchIdeas } from "@/lib/search-ideas"
import type { ContentTypeFilter } from "@/types/search"

export const dynamic = "force-dynamic"

function commaList(value: string | null) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function optionalNumber(value: string | null) {
  if (value === null || value === "") return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function optionalDate(value: string | null) {
  if (!value) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export async function GET(request: NextRequest) {
  const startedAt = performance.now()
  const params = request.nextUrl.searchParams
  const rawContentType = params.get("contentType")
  const contentType = ["all", "premium", "free"].includes(
    rawContentType ?? "",
  )
    ? (rawContentType as ContentTypeFilter)
    : undefined
  const rawSortBy = params.get("sortBy")
  const sortBy = ["relevance", "newest", "votes"].includes(rawSortBy ?? "")
    ? (rawSortBy as "relevance" | "newest" | "votes")
    : undefined

  const items = searchIdeas({
    query: params.get("q") ?? undefined,
    category: params.get("category") ?? undefined,
    tags: commaList(params.get("tags")),
    contentType,
    authors: commaList(params.get("authors")),
    dateFrom: optionalDate(params.get("dateFrom")),
    dateTo: optionalDate(params.get("dateTo")),
    voteMin: optionalNumber(params.get("voteMin")),
    voteMax: optionalNumber(params.get("voteMax")),
    sortBy,
  })

  const elapsedMs = Math.round((performance.now() - startedAt) * 100) / 100
  return NextResponse.json(
    { items, total: items.length, elapsedMs },
    {
      headers: {
        "Cache-Control": "no-store",
        "Server-Timing": `search;dur=${elapsedMs}`,
      },
    },
  )
}
