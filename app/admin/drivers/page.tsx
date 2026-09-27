"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Plus, Search, Edit, Trash2, User, Phone } from "lucide-react"

export default function AdminDriversPage() {
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

  const drivers = [
    {
      id: "1",
      name: "John Smith",
      phone: "+1 234-567-8900",
      license: "DL-1234567890",
      experience: "12 years",
      status: "Active",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      phone: "+1 234-567-8901",
      license: "DL-0987654321",
      experience: "8 years",
      status: "Active",
      rating: 4.9,
    },
    {
      id: "3",
      name: "Michael Brown",
      phone: "+1 234-567-8902",
      license: "DL-5678901234",
      experience: "15 years",
      status: "Active",
      rating: 4.7,
    },
    {
      id: "4",
      name: "Emily Davis",
      phone: "+1 234-567-8903",
      license: "DL-3456789012",
      experience: "6 years",
      status: "On Leave",
      rating: 4.6,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Manage Drivers</h1>
            <p className="text-muted-foreground">View and manage your driver database</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Driver
          </Button>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {drivers.map((driver) => (
            <Card key={driver.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{driver.name}</h3>
                        <Badge variant={driver.status === "Active" ? "default" : "secondary"}>{driver.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {driver.phone}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">License</div>
                      <div className="font-medium">{driver.license}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Experience</div>
                      <div className="font-medium">{driver.experience}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                      <div className="font-medium">{driver.rating}/5.0</div>
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
