"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"
import Link from "next/link"
import { mockBuses } from "@/lib/mock-data"
import { Suspense } from "react"

function PaymentContent({ busId }: { busId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const seats = searchParams.get("seats")?.split(",") || []
  const bus = mockBuses.find((b) => b.id === busId)
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = seats.length * (bus?.price || 0)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push(`/booking/${busId}/success?seats=${seats.join(",")}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/booking/${busId}/passenger?seats=${seats.join(",")}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Passenger Details
          </Link>
        </Button>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="h-6 w-6" />
                  Payment Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">Enter your card information to complete booking</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" maxLength={5} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" type="password" placeholder="123" maxLength={3} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-holder">Cardholder Name</Label>
                  <Input id="card-holder" placeholder="John Doe" />
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bus</span>
                    <span className="font-medium">{bus?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium">{seats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per seat</span>
                    <span className="font-medium">${bus?.price}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>
                </div>

                <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? "Processing..." : `Pay $${totalPrice}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage({ params }: { params: { busId: string } }) {
  const { busId } = params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent busId={busId} />
    </Suspense>
  )
}
