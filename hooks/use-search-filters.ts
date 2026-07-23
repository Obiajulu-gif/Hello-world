"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { SavedSearch, SearchFilters } from "@/types/search"
import { filtersToUrlParams, parseSearchQuery } from "@/lib/search-utils"

const SAVED_SEARCHES_KEY = "hello-world:saved-searches"

function compactFilters(filters: SearchFilters): SearchFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false
      if (Array.isArray(value)) return value.length > 0
      return true
    }),
  ) as SearchFilters
}

function deserializeSavedSearches(value: string): SavedSearch[] {
  const parsed = JSON.parse(value) as Array<
    Omit<SavedSearch, "createdAt"> & { createdAt: string }
  >
  return parsed.map((saved) => ({
    ...saved,
    createdAt: new Date(saved.createdAt),
    filters: {
      ...saved.filters,
      dateRange: saved.filters.dateRange
        ? {
            from: new Date(saved.filters.dateRange.from),
            to: new Date(saved.filters.dateRange.to),
          }
        : undefined,
    },
  }))
}

export function useSearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<SearchFilters>(() =>
    parseSearchQuery(searchParams),
  )
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  useEffect(() => {
    setFilters(parseSearchQuery(searchParams))
  }, [searchParams])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_SEARCHES_KEY)
      if (saved) setSavedSearches(deserializeSavedSearches(saved))
    } catch (error) {
      console.error("Failed to load saved searches", error)
    }
  }, [])

  const replaceUrl = useCallback(
    (nextFilters: SearchFilters) => {
      const params = filtersToUrlParams(nextFilters)
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router],
  )

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>) => {
      setFilters((current) => {
        const next = compactFilters({ ...current, ...updates })
        replaceUrl(next)
        return next
      })
    },
    [replaceUrl],
  )

  const clearFilters = useCallback(() => {
    setFilters({})
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  const persistSavedSearches = useCallback((items: SavedSearch[]) => {
    setSavedSearches(items)
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(items))
  }, [])

  const saveSearch = useCallback(
    (name: string) => {
      const saved: SavedSearch = {
        id: crypto.randomUUID(),
        name,
        filters: { ...filters },
        createdAt: new Date(),
      }
      persistSavedSearches([...savedSearches, saved])
    },
    [filters, persistSavedSearches, savedSearches],
  )

  const deleteSavedSearch = useCallback(
    (id: string) => {
      persistSavedSearches(savedSearches.filter((saved) => saved.id !== id))
    },
    [persistSavedSearches, savedSearches],
  )

  const loadSavedSearch = useCallback(
    (savedSearch: SavedSearch) => {
      const next = compactFilters(savedSearch.filters)
      setFilters(next)
      replaceUrl(next)
    },
    [replaceUrl],
  )

  return {
    filters,
    updateFilters,
    clearFilters,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,
  }
}
