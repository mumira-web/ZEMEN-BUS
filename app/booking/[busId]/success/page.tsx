"use client"

import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { mockBuses } from "@/lib/mock-data"
import { Suspense } from "react"

function SuccessContent({ busId }: { busId: string }) {
  const searchParams = useSearchParams()
  const seats = searchParams.get("seats")?.split(",") || []
  const bus = mockBuses.find((b) => b.id === busId)
  const bookingId = `BT${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle2 className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
              <p className="text-muted-foreground">Your bus ticket has been successfully booked</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="mb-2 text-sm text-muted-foreground">Booking ID</div>
                <div className="text-2xl font-bold">{bookingId}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Bus Service</div>
                    <div className="font-semibold">{bus?.name}</div>
                    <div className="text-sm text-muted-foreground">{bus?.operatorName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Journey Time</div>
                    <div className="font-semibold">
                      {bus?.departureTime} - {bus?.arrivalTime}
                    </div>
                    <div className="text-sm text-muted-foreground">{bus?.duration} duration</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">Seats Booked</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {seats.map((seat) => (
                        <Badge key={seat} variant="secondary">
                          Seat {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock QR Code */}
              <div className="rounded-lg border border-border bg-background p-6 text-center">
                <div className="mx-auto mb-4 h-48 w-48 rounded-lg bg-muted">
                  <img src="/qr-code.jpg" alt="Ticket QR Code" className="h-full w-full object-cover" />
                </div>
                <p className="text-sm text-muted-foreground">Scan this QR code when boarding</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Ticket
                </Button>
                <Button asChild className="w-full">
                  <Link href="/dashboard">View My Bookings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage({ params }: { params: { busId: string } }) {
  const { busId } = params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent busId={busId} />
    </Suspense>
  )
}
