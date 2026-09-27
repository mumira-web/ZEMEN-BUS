"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Plus, Calendar, Clock } from "lucide-react"

export default function AdminSchedulesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  const schedules = [
    {
      bus: "Express 101",
      route: "City A → City B",
      departure: "06:00 AM",
      arrival: "02:00 PM",
      days: ["Mon", "Wed", "Fri"],
      driver: "John Smith",
      status: "Active",
    },
    {
      bus: "Comfort Plus",
      route: "City B → City C",
      departure: "08:30 AM",
      arrival: "04:00 PM",
      days: ["Tue", "Thu", "Sat"],
      driver: "Sarah Johnson",
      status: "Active",
    },
    {
      bus: "Super Deluxe",
      route: "City A → City D",
      departure: "10:00 AM",
      arrival: "05:30 PM",
      days: ["Daily"],
      driver: "Michael Brown",
      status: "Active",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Manage Schedules</h1>
            <p className="text-muted-foreground">Configure bus schedules and timings</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Schedule
          </Button>
        </div>

        <div className="grid gap-4">
          {schedules.map((schedule, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{schedule.bus}</CardTitle>
                    <p className="text-sm text-muted-foreground">{schedule.route}</p>
                  </div>
                  <Badge>{schedule.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Departure</div>
                      <div className="font-medium">{schedule.departure}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Arrival</div>
                      <div className="font-medium">{schedule.arrival}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Days</div>
                      <div className="font-medium">{schedule.days.join(", ")}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Driver</div>
                    <div className="font-medium">{schedule.driver}</div>
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
