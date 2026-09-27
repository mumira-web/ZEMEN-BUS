"use client"

import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { BusSearchResults } from "@/components/bus-search-results"
import { SearchWidget } from "@/components/search-widget"
import { Suspense } from "react"

function SearchContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const date = searchParams.get("date") || ""

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-6 text-3xl font-bold">Available Buses</h1>
          <SearchWidget />
        </div>

        {from && to && date && (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{from}</span>
            <span>→</span>
            <span className="font-medium text-foreground">{to}</span>
            <span>•</span>
            <span>
              {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        )}

        <BusSearchResults />
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
