"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockBuses, generateSeats, type Seat } from "@/lib/mock-data"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"

export default function BookingPage({ params }: { params: { busId: string } }) {
  const { busId } = params
  const router = useRouter()
  const bus = mockBuses.find((b) => b.id === busId)
  const [seats, setSeats] = useState<Seat[]>(bus ? generateSeats(bus.id, bus.totalSeats) : [])
  const selectedSeats = seats.filter((s) => s.status === "selected")

  if (!bus) {
    return <div>Bus not found</div>
  }

  const toggleSeat = (seatId: string) => {
    setSeats(
      seats.map((seat) =>
        seat.id === seatId && seat.status !== "booked"
          ? { ...seat, status: seat.status === "selected" ? "available" : "selected" }
          : seat,
      ),
    )
  }

  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      const seatNumbers = selectedSeats.map((s) => s.number).join(",")
      router.push(`/booking/${busId}/passenger?seats=${seatNumbers}`)
    }
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{bus.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{bus.operatorName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary">{bus.busType}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{bus.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${bus.price}</div>
                    <div className="text-sm text-muted-foreground">per seat</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded border-2 border-border bg-background"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded border-2 border-primary bg-primary"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-muted"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                </div>

                {/* Bus Layout */}
                <div className="rounded-lg border border-border bg-card p-8">
                  <div className="mb-4 text-center text-sm font-medium text-muted-foreground">Driver</div>
                  <div className="grid grid-cols-4 gap-3">
                    {seats.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat.id)}
                        disabled={seat.status === "booked"}
                        className={`aspect-square rounded p-2 text-sm font-medium transition-all ${
                          seat.status === "available"
                            ? "border-2 border-border bg-background hover:border-primary"
                            : seat.status === "selected"
                              ? "border-2 border-primary bg-primary text-primary-foreground"
                              : "cursor-not-allowed bg-muted text-muted-foreground"
                        }`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-medium">City A → City B</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Departure</span>
                    <span className="font-medium">{bus.departureTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Arrival</span>
                    <span className="font-medium">{bus.arrivalTime}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="mb-2 text-sm font-medium">Selected Seats:</div>
                  {selectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat.id} variant="secondary">
                          {seat.number}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No seats selected</p>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedSeats.length} seat(s) selected</p>
                </div>

                <Button onClick={handleContinue} disabled={selectedSeats.length === 0} className="w-full" size="lg">
                  Continue to Passenger Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
