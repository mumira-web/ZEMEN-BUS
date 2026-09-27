"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockBuses } from "@/lib/mock-data"
import { Clock, MapPin, Star, Armchair } from "lucide-react"
import Link from "next/link"

export function BusSearchResults() {
  return (
    <div className="space-y-4">
      {mockBuses.map((bus) => (
        <Card key={bus.id} className="overflow-hidden transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Bus Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{bus.name}</h3>
                    <p className="text-sm text-muted-foreground">{bus.operatorName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{bus.rating}</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">{bus.departureTime}</div>
                      <div className="text-muted-foreground">Departure</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">{bus.duration}</div>
                      <div className="text-muted-foreground">Duration</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium">{bus.arrivalTime}</div>
                      <div className="text-muted-foreground">Arrival</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{bus.busType}</Badge>
                  {bus.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price & Book */}
              <div className="flex flex-col items-end gap-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">${bus.price}</div>
                  <div className="text-sm text-muted-foreground">per seat</div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Armchair className="h-4 w-4" />
                  <span>
                    {bus.seatsAvailable} of {bus.totalSeats} seats left
                  </span>
                </div>

                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/booking/${bus.id}`}>Select Seats</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
