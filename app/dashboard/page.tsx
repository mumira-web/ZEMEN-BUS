"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { mockBookings } from "@/lib/mock-data"
import { Calendar, MapPin, Clock, Download, Ticket, CheckCircle2, XCircle } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const upcomingBookings = mockBookings.filter((b) => b.status === "Upcoming")
  const pastBookings = mockBookings.filter((b) => b.status === "Completed")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming Trips</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <CheckCircle2 className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pastBookings.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockBookings.filter((b) => b.status === "Cancelled").length}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockBookings.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{booking.busName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.operatorName}</p>
                          </div>
                          <Badge>{booking.status}</Badge>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">
                                {booking.from} → {booking.to}
                              </div>
                              <div className="text-muted-foreground">Route</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">
                                {new Date(booking.travelDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-muted-foreground">Travel Date</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">{booking.departureTime}</div>
                              <div className="text-muted-foreground">Departure</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Booking ID:</span>{" "}
                            <span className="font-medium">{booking.id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Seats:</span>{" "}
                            <span className="font-medium">{booking.seats.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>{" "}
                            <span className="font-medium text-primary">${booking.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          Download Ticket
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <a href="/track">Track Bus</a>
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Ticket className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No Upcoming Trips</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Book your next journey to see it here</p>
                  <Button asChild>
                    <a href="/">Search Buses</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden opacity-75">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{booking.busName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.operatorName}</p>
                          </div>
                          <Badge variant="secondary">{booking.status}</Badge>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">
                                {booking.from} → {booking.to}
                              </div>
                              <div className="text-muted-foreground">Route</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">
                                {new Date(booking.travelDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="text-muted-foreground">Travel Date</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">{booking.departureTime}</div>
                              <div className="text-muted-foreground">Departure</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Booking ID:</span>{" "}
                            <span className="font-medium">{booking.id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Seats:</span>{" "}
                            <span className="font-medium">{booking.seats.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>{" "}
                            <span className="font-medium">${booking.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        <Button variant="outline" className="w-full bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No Past Bookings</h3>
                  <p className="text-sm text-muted-foreground">Your completed trips will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
