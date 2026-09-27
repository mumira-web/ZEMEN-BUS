"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function SearchWidget() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")

  const handleSearch = () => {
    if (from && to && date) {
      router.push(`/search?from=${from}&to=${to}&date=${date}`)
    }
  }

  return (
    <Card className="w-full max-w-4xl p-6 shadow-lg">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="from" className="text-sm font-medium">
            From
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="from"
              placeholder="Departure city"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to" className="text-sm font-medium">
            To
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="to"
              placeholder="Arrival city"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">
            Date
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="pl-10" />
          </div>
        </div>
      </div>

      <Button onClick={handleSearch} className="mt-6 w-full" size="lg">
        <Search className="mr-2 h-5 w-5" />
        Search Buses
      </Button>
    </Card>
  )
}
