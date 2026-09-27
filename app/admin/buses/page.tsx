"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Plus, Search, Edit, Trash2, Bus } from "lucide-react"

export default function AdminBusesPage() {
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

  const buses = [
    {
      id: "1",
      number: "MH12AB1234",
      name: "Express 101",
      type: "AC Seater",
      capacity: 40,
      status: "Active",
      operator: "Metro Travels",
    },
    {
      id: "2",
      number: "MH14CD5678",
      name: "Comfort Plus",
      type: "AC Sleeper",
      capacity: 36,
      status: "Active",
      operator: "Royal Express",
    },
    {
      id: "3",
      number: "MH16EF9012",
      name: "Super Deluxe",
      type: "Volvo Multi-Axle",
      capacity: 32,
      status: "Active",
      operator: "Prime Coaches",
    },
    {
      id: "4",
      number: "MH18GH3456",
      name: "Night Rider",
      type: "AC Sleeper",
      capacity: 40,
      status: "Maintenance",
      operator: "Moonlight Travels",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Manage Buses</h1>
            <p className="text-muted-foreground">Add, edit, or remove buses from your fleet</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Bus
          </Button>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by bus number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {buses.map((bus) => (
            <Card key={bus.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Bus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{bus.name}</h3>
                        <Badge variant={bus.status === "Active" ? "default" : "secondary"}>{bus.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{bus.number}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="font-medium">{bus.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Capacity</div>
                      <div className="font-medium">{bus.capacity} seats</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Operator</div>
                      <div className="font-medium">{bus.operator}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
