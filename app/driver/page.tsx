"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bell,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  User,
  Navigation,
  Phone,
  Mail,
  Ticket,
} from "lucide-react"
import { mockDriverTrips, mockNotifications, type DriverTrip, type Notification } from "@/lib/mock-data"
import { Header } from "@/components/header"

export default function DriverDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState<DriverTrip[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTrip, setActiveTrip] = useState<DriverTrip | null>(null)
  const [gpsLocation, setGpsLocation] = useState({ lat: "40.7128", lng: "-74.0060" })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "driver")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.role === "driver") {
      setTrips(mockDriverTrips)
      setNotifications(mockNotifications.filter((n) => n.recipientRole === "driver" || n.recipientRole === "all"))
      const active = mockDriverTrips.find((t) => t.status === "In Progress")
      if (active) setActiveTrip(active)
    }
  }, [user])

  const handleUpdateLocation = () => {
    alert(`GPS Location updated to: ${gpsLocation.lat}, ${gpsLocation.lng}`)
  }

  const handleUpdateTripStatus = (tripId: string, newStatus: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, status: newStatus as "Scheduled" | "In Progress" | "Completed" | "Cancelled" }
          : trip,
      ),
    )
    alert(`Trip ${tripId} status updated to ${newStatus}`)
  }

  if (isLoading || !user) {
    return null
  }

  const scheduledTrips = trips.filter((t) => t.status === "Scheduled")
  const activeTrips = trips.filter((t) => t.status === "In Progress")
  const completedTrips = trips.filter((t) => t.status === "Completed")
  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Trips</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledTrips.length}</div>
              <p className="text-xs text-muted-foreground">Upcoming assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trip</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTrips.length}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Trips</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTrips.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadNotifications}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Trip</TabsTrigger>
            <TabsTrigger value="trips">All Trips</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeTrip ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Trip Details</CardTitle>
                    <CardDescription>Trip ID: {activeTrip.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{activeTrip.route}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activeTrip.busName} • {activeTrip.busNumber}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{activeTrip.tripDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {activeTrip.departureTime} - {activeTrip.arrivalTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>From: {activeTrip.from}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>To: {activeTrip.to}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{activeTrip.passengers} passengers</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => handleUpdateTripStatus(activeTrip.id, "Completed")}>
                          Complete Trip
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleUpdateTripStatus(activeTrip.id, "Cancelled")}
                        >
                          Cancel Trip
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>GPS Location Update</CardTitle>
                    <CardDescription>Update your current location</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={gpsLocation.lat}
                        onChange={(e) => setGpsLocation({ ...gpsLocation, lat: e.target.value })}
                        placeholder="40.7128"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={gpsLocation.lng}
                        onChange={(e) => setGpsLocation({ ...gpsLocation, lng: e.target.value })}
                        placeholder="-74.0060"
                      />
                    </div>
                    <Button className="w-full" onClick={handleUpdateLocation}>
                      <Navigation className="mr-2 h-4 w-4" />
                      Update Location
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Your location is being tracked automatically
                    </p>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Passenger List</CardTitle>
                    <CardDescription>{activeTrip.passengers} passengers on this trip</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: activeTrip.passengers }, (_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Passenger {i + 1}</p>
                              <p className="text-sm text-muted-foreground">Seat: {i + 1}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              <Ticket className="mr-1 h-3 w-3" />
                              Boarded
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No Active Trip</h3>
                  <p className="text-sm text-muted-foreground">You don't have any active trips at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Assigned Trips</CardTitle>
                <CardDescription>View and manage your trip assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <Card key={trip.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{trip.route}</h3>
                              <Badge
                                variant={
                                  trip.status === "Completed"
                                    ? "secondary"
                                    : trip.status === "In Progress"
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {trip.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {trip.busName} • {trip.busNumber}
                            </p>
                          </div>
                          {trip.status === "Scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateTripStatus(trip.id, "In Progress")}
                            >
                              Start Trip
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.tripDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {trip.departureTime} - {trip.arrivalTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.passengers} passengers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {trip.from} → {trip.to}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with important messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${!notification.read ? "bg-accent/50" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {notification.type === "warning" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                          {notification.type === "info" && <Bell className="h-4 w-4 text-blue-500" />}
                          {notification.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          <h4 className="font-semibold">{notification.title}</h4>
                        </div>
                        {!notification.read && <Badge variant="default">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Driver Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge className="mt-1">Active Driver</Badge>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trips</p>
                        <p className="text-2xl font-bold">145</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-2xl font-bold">4.8</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="text-2xl font-bold">2 years</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </div>

                    <Button className="w-full">Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
