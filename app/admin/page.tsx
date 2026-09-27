"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Bus, Route, Users, Ticket, TrendingUp, Calendar, DollarSign, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const stats = [
    { title: "Total Buses", value: "45", icon: Bus, change: "+2 this month", trend: "up" },
    { title: "Active Routes", value: "28", icon: Route, change: "+4 this month", trend: "up" },
    { title: "Registered Drivers", value: "67", icon: Users, change: "+5 this month", trend: "up" },
    { title: "Today's Bookings", value: "142", icon: Ticket, change: "+12% from yesterday", trend: "up" },
    { title: "Monthly Revenue", value: "$45,280", icon: DollarSign, change: "+15% from last month", trend: "up" },
    { title: "Scheduled Trips", value: "89", icon: Calendar, change: "Today", trend: "neutral" },
    { title: "Average Occupancy", value: "78%", icon: TrendingUp, change: "+5% this week", trend: "up" },
    { title: "Active Alerts", value: "3", icon: AlertCircle, change: "Requires attention", trend: "down" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your bus fleet, routes, drivers, and bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`text-xs ${
                    stat.trend === "up"
                      ? "text-secondary"
                      : stat.trend === "down"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/buses">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Bus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Manage Buses</div>
                    <div className="text-sm text-muted-foreground">Add, edit, or remove</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/routes">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                    <Route className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold">Manage Routes</div>
                    <div className="text-sm text-muted-foreground">Configure routes</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/drivers">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Manage Drivers</div>
                    <div className="text-sm text-muted-foreground">Driver database</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/tickets">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">View Tickets</div>
                    <div className="text-sm text-muted-foreground">All bookings</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "BT8X9Y2Z1A", bus: "Express 101", route: "City A → City B", amount: "$90", time: "5 min ago" },
                  {
                    id: "BT7W6V5U4T",
                    bus: "Comfort Plus",
                    route: "City B → City C",
                    amount: "$55",
                    time: "12 min ago",
                  },
                  {
                    id: "BT6P5M4L3K",
                    bus: "Super Deluxe",
                    route: "City A → City D",
                    amount: "$130",
                    time: "25 min ago",
                  },
                ].map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{booking.bus}</div>
                      <div className="text-sm text-muted-foreground">{booking.route}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{booking.amount}</div>
                      <div className="text-xs text-muted-foreground">{booking.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Bus Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { bus: "Express 101", status: "On Time", progress: 45, route: "City A → City B" },
                  { bus: "Comfort Plus", status: "Delayed", progress: 65, route: "City B → City C" },
                  { bus: "Super Deluxe", status: "En Route", progress: 90, route: "City A → City D" },
                ].map((bus, index) => (
                  <div key={index} className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{bus.bus}</div>
                        <div className="text-sm text-muted-foreground">{bus.route}</div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          bus.status === "On Time"
                            ? "text-secondary"
                            : bus.status === "Delayed"
                              ? "text-destructive"
                              : "text-primary"
                        }`}
                      >
                        {bus.status}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-all" style={{ width: `${bus.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
