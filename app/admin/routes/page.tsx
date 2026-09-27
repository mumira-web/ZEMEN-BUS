"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { Plus, Search, Edit, Trash2, Route } from "lucide-react"

export default function AdminRoutesPage() {
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

  const routes = [
    { id: "1", name: "City A to City B", from: "City A", to: "City B", distance: "320 km", duration: "8h", buses: 12 },
    { id: "2", name: "City B to City C", from: "City B", to: "City C", distance: "280 km", duration: "7h", buses: 8 },
    { id: "3", name: "City A to City D", from: "City A", to: "City D", distance: "350 km", duration: "9h", buses: 6 },
    { id: "4", name: "City C to City A", from: "City C", to: "City A", distance: "300 km", duration: "8h", buses: 10 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Manage Routes</h1>
            <p className="text-muted-foreground">Configure routes and schedules</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Route
          </Button>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                      <Route className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{route.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {route.from} → {route.to}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                      <div className="font-medium">{route.distance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-medium">{route.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Buses</div>
                      <div className="font-medium">{route.buses} active</div>
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
