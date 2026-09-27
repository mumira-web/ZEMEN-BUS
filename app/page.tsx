import { Header } from "@/components/header"
import { SearchWidget } from "@/components/search-widget"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Shield, Clock, CreditCard, Radio, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mx-auto max-w-2xl text-center lg:text-left lg:mx-0">
              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Travel Smart with <span className="text-primary">BusTrack</span>
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                Book your bus tickets in seconds and track your journey in real-time. Experience modern, hassle-free
                travel with live updates and seamless booking.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" className="min-w-40" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="min-w-40 bg-transparent" asChild>
                  <Link href="/track">Track Bus</Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/modern-luxury-bus-exterior-on-highway.jpg"
                  alt="Modern luxury bus"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <SearchWidget />
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">How BusTrack Works</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Experience seamless travel with our modern features
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/ethiopian-person-making-mobile-payment-for-bus-ticket-addis-ababa.jpg"
                  alt="Making online payment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">Online Payment</h3>
                  <p className="text-sm text-white/90 mt-1">Pay securely from anywhere</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/ethiopian-passenger-tracking-bus-on-phone-addis-ababa-street.jpg"
                  alt="Tracking bus from anywhere"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">Track Anywhere</h3>
                  <p className="text-sm text-white/90 mt-1">Real-time bus location</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/ethiopian-passenger-showing-qr-code-ticket-boarding-bus-addis-ababa.jpg"
                  alt="Digital QR code tickets"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">Digital Tickets</h3>
                  <p className="text-sm text-white/90 mt-1">QR code instant boarding</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="group cursor-pointer transition-all hover:shadow-lg" asChild>
              <Link href="/track">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Radio className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Track Bus</h3>
                    <p className="text-sm text-muted-foreground">Live GPS tracking</p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer transition-all hover:shadow-lg" asChild>
              <Link href="/dashboard">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Tickets</h3>
                    <p className="text-sm text-muted-foreground">Manage bookings</p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer transition-all hover:shadow-lg" asChild>
              <Link href="/support">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Support</h3>
                    <p className="text-sm text-muted-foreground">24/7 assistance</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Why Choose BusTrack?</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Experience the future of bus travel with our modern platform
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Real-Time Tracking</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Know exactly where your bus is with live GPS tracking and accurate ETAs
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Instant Booking</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Book tickets in seconds with our streamlined booking process
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Secure Payments</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your transactions are protected with industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">© 2025 BusTrack. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
