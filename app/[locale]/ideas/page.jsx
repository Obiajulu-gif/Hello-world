"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { SocialIcons } from "@/components/social-icons"
import { GradientText } from "@/components/gradient-text"
import { NotificationsPanel } from "@/components/notifications-panel"
import { AdvancedSearch, HighlightText } from "@/components/advanced-search"
import { IdeasFilter } from "@/components/idea-filter"

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export default function IdeasPage() {
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()
  const query = searchParams.get("q") ?? ""
  const [result, setResult] = useState({ items: [], total: 0, elapsedMs: 0 })
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setIsPending(true)
      setError("")
      try {
        const response = await fetch(
          `/api/ideas/search${queryString ? `?${queryString}` : ""}`,
          { signal: controller.signal, cache: "no-store" },
        )
        if (!response.ok) throw new Error("Search request failed")
        setResult(await response.json())
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError("Ideas could not be loaded. Please try again.")
        }
      } finally {
        if (!controller.signal.aborted) setIsPending(false)
      }
    }
    load()
    return () => controller.abort()
  }, [queryString, refreshKey])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <MobileNav />
            <Link href="/" className="ml-2 flex items-center gap-2 md:ml-0">
              <Image src="/logo.jpg" alt="Hello-World Logo" width={32} height={32} className="rounded-sm" />
              <span className="font-bold">Hello-World</span>
            </Link>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/ideas" className="text-sm font-medium underline underline-offset-4">Ideas</Link>
            <Link href="/market" className="text-sm font-medium hover:underline underline-offset-4">Market Data</Link>
            <Link href="/premium" className="text-sm font-medium hover:underline underline-offset-4">Premium</Link>
            <Link href="/community" className="text-sm font-medium hover:underline underline-offset-4">Community</Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationsPanel />
            <WalletConnect />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl"><GradientText>Community Ideas</GradientText></h1>
              <p className="mt-1 text-sm text-muted-foreground">Search titles, descriptions, authors, categories, and tags.</p>
            </div>
            <Link href="/ideas/new"><Button>Share Your Idea</Button></Link>
          </div>

          <AdvancedSearch onSearch={refresh} isPending={isPending} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside><IdeasFilter onApply={refresh} /></aside>
            <section aria-live="polite">
              <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>{isPending ? "Searching…" : `${result.total} result${result.total === 1 ? "" : "s"}`}</span>
                {!isPending && <span>Server search: {result.elapsedMs}ms</span>}
              </div>

              {error && (
                <Card className="border-destructive/40"><CardContent className="flex items-center justify-between py-6"><span>{error}</span><Button variant="outline" onClick={refresh}>Retry</Button></CardContent></Card>
              )}

              {!error && !isPending && result.items.length === 0 && (
                <Card><CardContent className="py-12 text-center"><h2 className="font-semibold">No matching ideas</h2><p className="mt-2 text-sm text-muted-foreground">Try a broader search or remove one of the selected filters.</p></CardContent></Card>
              )}

              <div className="space-y-4">
                {result.items.map((idea) => (
                  <Card key={idea.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle>
                            <Link href={`/ideas/${idea.id}`} className="hover:underline">
                              <GradientText><HighlightText text={idea.title} highlight={query} /></GradientText>
                            </Link>
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge>{idea.category}</Badge>
                            {idea.premium && <Badge variant="secondary">Premium</Badge>}
                          </div>
                        </div>
                      </div>
                      <CardDescription><HighlightText text={idea.excerpt} highlight={query} /></CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {idea.tags.map((tag) => <Badge key={tag} variant="outline"><HighlightText text={tag} highlight={query} /></Badge>)}
                      </div>
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" />{idea.votes} votes</span>
                          <span className="flex items-center gap-1"><Users className="h-4 w-4" /><HighlightText text={idea.author} highlight={query} /></span>
                          <span>{formatDate(idea.publishedAt)}</span>
                        </div>
                        <Link href={`/ideas/${idea.id}`}><Button variant="ghost" size="sm">Read More</Button></Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-6">
          <div className="flex items-center gap-2"><Image src="/logo.jpg" alt="Hello-World Logo" width={24} height={24} className="rounded-sm" /><p className="text-xs text-muted-foreground sm:text-sm">&copy; {new Date().getFullYear()} Hello-World. All rights reserved.</p></div>
          <div className="flex items-center gap-4"><SocialIcons /><div className="flex gap-4"><Link href="/terms" className="text-xs text-muted-foreground hover:underline sm:text-sm">Terms</Link><Link href="/privacy" className="text-xs text-muted-foreground hover:underline sm:text-sm">Privacy</Link></div></div>
        </div>
      </footer>
    </div>
  )
}
