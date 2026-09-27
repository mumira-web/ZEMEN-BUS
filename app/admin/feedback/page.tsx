"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react"
import { mockFeedback, type Feedback } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminFeedbackPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const pendingFeedback = feedback.filter((f) => f.status === "Pending")
  const inProgressFeedback = feedback.filter((f) => f.status === "In Progress")
  const resolvedFeedback = feedback.filter((f) => f.status === "Resolved")

  const handleUpdateStatus = () => {
    if (selectedFeedback) {
      setFeedback(
        feedback.map((f) =>
          f.id === selectedFeedback.id ? { ...f, status: status as Feedback["status"], adminNotes } : f,
        ),
      )
      setSelectedFeedback(null)
      setAdminNotes("")
      setStatus("")
    }
  }

  const FeedbackCard = ({ item }: { item: Feedback }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{item.subject}</h3>
              <Badge
                variant={
                  item.status === "Resolved" ? "default" : item.status === "In Progress" ? "secondary" : "outline"
                }
              >
                {item.status}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              By {item.passengerName} • Booking: {item.bookingId}
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFeedback(item)
                  setAdminNotes(item.adminNotes || "")
                  setStatus(item.status)
                }}
              >
                Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{item.subject}</DialogTitle>
                <DialogDescription>
                  Submitted by {item.passengerName} on {item.date}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Message</Label>
                  <p className="text-sm mt-2 p-3 bg-muted rounded-lg">{item.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <p className="text-sm mt-1">{item.category}</p>
                  </div>
                  <div>
                    <Label>Booking ID</Label>
                    <p className="text-sm mt-1">{item.bookingId}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add internal notes about the resolution..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                <Button onClick={handleUpdateStatus} className="w-full">
                  Update Status
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{item.message}</p>

        {item.adminNotes && (
          <div className="mt-3 p-3 bg-accent rounded-lg">
            <p className="text-xs font-semibold mb-1">Admin Notes:</p>
            <p className="text-xs text-muted-foreground">{item.adminNotes}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">{item.date}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feedback & Complaints</h1>
          <p className="text-muted-foreground">Review and manage customer feedback</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFeedback.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressFeedback.length}</div>
              <p className="text-xs text-muted-foreground">Being handled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedFeedback.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {feedback.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {pendingFeedback.length > 0 && (
                <Badge variant="default" className="ml-2">
                  {pendingFeedback.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {feedback.map((item) => (
              <FeedbackCard key={item.id} item={item} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingFeedback.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending feedback</p>
                </CardContent>
              </Card>
            ) : (
              pendingFeedback.map((item) => <FeedbackCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="inprogress" className="space-y-4">
            {inProgressFeedback.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No feedback in progress</p>
                </CardContent>
              </Card>
            ) : (
              inProgressFeedback.map((item) => <FeedbackCard key={item.id} item={item} />)
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedFeedback.map((item) => (
              <FeedbackCard key={item.id} item={item} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
