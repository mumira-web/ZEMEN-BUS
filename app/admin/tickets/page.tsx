"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { mockBookings } from "@/lib/mock-data"
import { Search } from "lucide-react"
import { useState } from "react"

export default function AdminTicketsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Manage Tickets</h1>
          <p className="text-muted-foreground">View and manage all bookings</p>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID, passenger name, or bus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {mockBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{booking.id}</h3>
                      <Badge
                        variant={
                          booking.status === "Upcoming"
                            ? "default"
                            : booking.status === "Completed"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground">Passenger:</span>{" "}
                        <span className="font-medium">{booking.passengerName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bus:</span>{" "}
                        <span className="font-medium">{booking.busName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Route:</span>{" "}
                        <span className="font-medium">
                          {booking.from} → {booking.to}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Seats:</span>{" "}
                        <span className="font-medium">{booking.seats.join(", ")}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Travel Date:</span>{" "}
                        <span className="font-medium">
                          {new Date(booking.travelDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>{" "}
                        <span className="font-medium text-primary">${booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
