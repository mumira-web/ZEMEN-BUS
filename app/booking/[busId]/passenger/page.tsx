"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function PassengerDetailsContent({ busId }: { busId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const seats = searchParams.get("seats")?.split(",") || []

  const [passengers, setPassengers] = useState<Array<{ name: string; age: string; gender: string }>>(
    seats.map(() => ({ name: "", age: "", gender: "" })),
  )

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    setPassengers(updated)
  }

  const handleContinue = () => {
    router.push(`/booking/${busId}/payment?seats=${seats.join(",")}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/booking/${busId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Seat Selection
          </Link>
        </Button>

        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Passenger Details</CardTitle>
              <p className="text-sm text-muted-foreground">Enter details for {seats.length} passenger(s)</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="space-y-4 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Passenger {index + 1}</h3>
                    <span className="text-sm text-muted-foreground">Seat: {seats[index]}</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Full Name</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="John Doe"
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`age-${index}`}>Age</Label>
                      <Input
                        id={`age-${index}`}
                        type="number"
                        placeholder="25"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`gender-${index}`}>Gender</Label>
                      <select
                        id={`gender-${index}`}
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={handleContinue} className="w-full" size="lg">
                Continue to Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PassengerDetailsPage({ params }: { params: { busId: string } }) {
  const { busId } = params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PassengerDetailsContent busId={busId} />
    </Suspense>
  )
}
