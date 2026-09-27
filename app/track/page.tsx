"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, Phone, User, Navigation } from "lucide-react"
import { trackingBuses } from "@/lib/mock-data"
import Link from "next/link"

export default function TrackPage() {
  const [busNumber, setBusNumber] = useState("")
  const [selectedBus, setSelectedBus] = useState<string | null>(null)

  const handleSearch = () => {
    const found = trackingBuses.find((bus) => bus.busNumber.toLowerCase().includes(busNumber.toLowerCase()))
    if (found) {
      setSelectedBus(found.id)
    }
  }

  const trackedBus = trackingBuses.find((bus) => bus.id === selectedBus)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Track Your Bus</h1>
          <p className="text-muted-foreground">Enter your bus number or booking ID to track in real-time</p>
        </div>

        <div className="mb-8 flex gap-3">
          <div className="flex-1">
            <Label htmlFor="bus-number" className="sr-only">
              Bus Number
            </Label>
            <Input
              id="bus-number"
              placeholder="Enter bus number (e.g., MH12AB1234)"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Track
          </Button>
        </div>

        {!selectedBus ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Buses</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trackingBuses.map((bus) => (
                <Card
                  key={bus.id}
                  className="cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => setSelectedBus(bus.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{bus.busName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                      </div>
                      <Badge
                        variant={
                          bus.status === "On Time" ? "default" : bus.status === "Delayed" ? "destructive" : "secondary"
                        }
                      >
                        {bus.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Route:</span>
                        <span className="font-medium">{bus.route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">ETA:</span>
                        <span className="font-medium">{bus.eta}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          trackedBus && (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{trackedBus.busName}</CardTitle>
                        <p className="mt-1 text-muted-foreground">{trackedBus.busNumber}</p>
                      </div>
                      <Badge
                        variant={
                          trackedBus.status === "On Time"
                            ? "default"
                            : trackedBus.status === "Delayed"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-base px-3 py-1"
                      >
                        {trackedBus.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Mock Map */}
                    <div className="relative mb-6 h-96 overflow-hidden rounded-lg bg-muted">
                      <img
                        src="/gps-map-with-route-and-bus-marker.jpg"
                        alt="Bus location map"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-lg bg-background/90 p-4 shadow-lg backdrop-blur">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary animate-pulse">
                              <Navigation className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                              <div className="font-semibold">{trackedBus.currentLocation}</div>
                              <div className="text-sm text-muted-foreground">Current Location</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{trackedBus.from}</span>
                        <span className="font-medium">{trackedBus.to}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${trackedBus.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{trackedBus.departureTime}</span>
                        <span>{trackedBus.progress}% completed</span>
                        <span>{trackedBus.arrivalTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" onClick={() => setSelectedBus(null)} className="w-full bg-transparent">
                  View All Buses
                </Button>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Journey Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Estimated Arrival</div>
                        <div className="font-semibold">{trackedBus.eta}</div>
                        {trackedBus.delay > 0 && (
                          <div className="text-xs text-destructive">{trackedBus.delay} min delay</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                        <MapPin className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Current Location</div>
                        <div className="text-sm font-medium">{trackedBus.currentLocation}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Route</div>
                        <div className="text-sm font-medium">{trackedBus.route}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Driver Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Driver Name</div>
                        <div className="font-medium">{trackedBus.driverName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                        <Phone className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">Contact</div>
                        <Link href={`tel:${trackedBus.driverPhone}`} className="font-medium hover:text-primary">
                          {trackedBus.driverPhone}
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
