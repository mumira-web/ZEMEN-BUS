"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bus, Menu, X, User, LayoutDashboard, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold">BusTrack</span>
            <span className="ml-2 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Admin</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/users" className="text-sm font-medium hover:text-primary transition-colors">
            Users
          </Link>
          <Link href="/admin/buses" className="text-sm font-medium hover:text-primary transition-colors">
            Buses
          </Link>
          <Link href="/admin/routes" className="text-sm font-medium hover:text-primary transition-colors">
            Routes
          </Link>
          <Link href="/admin/drivers" className="text-sm font-medium hover:text-primary transition-colors">
            Drivers
          </Link>
          <Link href="/admin/schedules" className="text-sm font-medium hover:text-primary transition-colors">
            Schedules
          </Link>
          <Link href="/admin/tickets" className="text-sm font-medium hover:text-primary transition-colors">
            Tickets
          </Link>
          <Link href="/admin/feedback" className="text-sm font-medium hover:text-primary transition-colors">
            Feedback
          </Link>
          <Link href="/admin/notifications" className="text-sm font-medium hover:text-primary transition-colors">
            Notifications
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  User Portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium hover:text-primary transition-colors">
              Users
            </Link>
            <Link href="/admin/buses" className="text-sm font-medium hover:text-primary transition-colors">
              Buses
            </Link>
            <Link href="/admin/routes" className="text-sm font-medium hover:text-primary transition-colors">
              Routes
            </Link>
            <Link href="/admin/drivers" className="text-sm font-medium hover:text-primary transition-colors">
              Drivers
            </Link>
            <Link href="/admin/schedules" className="text-sm font-medium hover:text-primary transition-colors">
              Schedules
            </Link>
            <Link href="/admin/tickets" className="text-sm font-medium hover:text-primary transition-colors">
              Tickets
            </Link>
            <Link href="/admin/feedback" className="text-sm font-medium hover:text-primary transition-colors">
              Feedback
            </Link>
            <Link href="/admin/notifications" className="text-sm font-medium hover:text-primary transition-colors">
              Notifications
            </Link>
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/">User Portal</Link>
              </Button>
              <Button variant="ghost" onClick={logout} className="w-full justify-start">
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
