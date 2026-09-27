# Frontend Integration Guide

This guide explains how to connect the Next.js frontend to the Node.js backend.

## Overview

The frontend communicates with the backend through REST API calls. All API functions are centralized in `/lib/api.ts` for easy maintenance and consistency.

## Files Structure

```
/lib
  ├── api.ts              # All API functions
  ├── auth-context.tsx    # Authentication state management
  └── utils.ts

/hooks
  └── useApi.ts           # Custom React hooks for API calls

/.env.local              # Environment variables
```

## Setup Instructions

### 1. Ensure Backend is Running

```bash
cd bus-tracking-backend
npm install
npm run dev
```

The backend should be running on `http://localhost:5000`

### 2. Set Environment Variables

Create `.env.local` in the project root (already created):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, update with your backend URL:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### 3. Start Frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

## Architecture

### Authentication Flow

```
User Login Form
    ↓
loginUser() in /lib/api.ts
    ↓
Backend: POST /api/auth/login
    ↓
Backend returns JWT token
    ↓
setAuthToken() stores token in localStorage
    ↓
AuthContext updates user state
    ↓
Redirect to dashboard/admin/driver
```

### API Call Pattern

All API calls follow this pattern:

```typescript
// In /lib/api.ts
export async function getBuses() {
  return authenticatedFetch('/buses')
}

// In a component
import { getBuses } from '@/lib/api'

const buses = await getBuses()
```

### Authentication Header

Every API call automatically includes the JWT token:

```typescript
// Automatically added by authenticatedFetch()
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

## Using API in Components

### Option 1: Using useApi Hook

```typescript
'use client'

import { useApi } from '@/hooks/useApi'
import { getBuses } from '@/lib/api'

export function BusList() {
  const { data: buses, loading, error, fetchData } = useApi<Bus[]>([])

  useEffect(() => {
    fetchData('/buses')
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {buses?.map(bus => (
        <li key={bus.id}>{bus.bus_number}</li>
      ))}
    </ul>
  )
}
```

### Option 2: Direct API Call

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getBuses } from '@/lib/api'

export function BusList() {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true)
      try {
        const data = await getBuses()
        setBuses(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBuses()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {buses.map(bus => (
        <li key={bus.id}>{bus.bus_number}</li>
      ))}
    </ul>
  )
}
```

### Option 3: Using useApiMutation for Actions

```typescript
'use client'

import { useApiMutation } from '@/hooks/useApi'
import { createBooking } from '@/lib/api'

export function BookingForm() {
  const { mutate: submitBooking, loading, error } = useApiMutation(
    (data) => createBooking(
      data.scheduleId,
      data.busId,
      data.seats,
      data.passengerInfo,
      data.totalPrice
    )
  )

  const handleSubmit = async (formData) => {
    await submitBooking(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Booking...' : 'Book Now'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}
```

## Available API Functions

### Authentication
```typescript
loginUser(email, password)
registerUser(email, password, name, phone, role)
getCurrentUser()
```

### Buses
```typescript
getBuses(filters?)
getBusById(busId)
getBusLocation(busId)
updateBusLocation(busId, latitude, longitude)
createBus(busNumber, capacity, companyName)
getBusRoute(busId)
```

### Bookings
```typescript
getAvailableSeats(scheduleId)
createBooking(scheduleId, busId, seats, passengerInfo, totalPrice)
getUserBookings()
getBookingById(bookingId)
cancelBooking(bookingId)
rescheduleBooking(bookingId, newScheduleId)
```

### Driver
```typescript
getDriverTrips()
startTrip(tripId)
completeTrip(tripId)
cancelTrip(tripId)
getTripPassengers(tripId)
getDriverProfile()
updateDriverProfile(updates)
```

### Feedback
```typescript
submitFeedback(busId, rating, comment)
getAllFeedback()
updateFeedbackStatus(feedbackId, status)
addFeedbackNote(feedbackId, note)
```

### Notifications
```typescript
getUserNotifications()
markNotificationAsRead(notificationId)
sendNotification(userIds, message, type)
broadcastNotification(role, message)
```

### Admin
```typescript
getAllUsers(role?)
suspendUser(userId)
activateUser(userId)
getAdminStats()
```

## Error Handling

All API calls throw errors if the response is not ok:

```typescript
try {
  const buses = await getBuses()
} catch (error) {
  if (error.message === 'Invalid token') {
    // Redirect to login
  } else {
    // Show error message
  }
}
```

To handle 401 (Unauthorized) globally, add this to your root layout:

```typescript
useEffect(() => {
  const handleUnauthorized = (error) => {
    if (error.status === 401) {
      logout()
      router.push('/login')
    }
  }
}, [])
```

## Demo Test Accounts

Use these credentials to test the frontend:

```
Passenger:
  Email: passenger@test.com
  Password: password123

Driver:
  Email: driver@test.com
  Password: password123

Admin:
  Email: admin@test.com
  Password: password123
```

First register these users in the backend, or add them directly to the database.

## Troubleshooting

### 1. CORS Error

If you see "CORS error", ensure:
- Backend is running on port 5000
- `NEXT_PUBLIC_API_URL` is set correctly
- Backend has `cors` package installed and enabled

### 2. 401 Unauthorized

Token is invalid or expired:
- Clear localStorage
- Login again to get new token

### 3. 404 Not Found

Endpoint doesn't exist:
- Check API_DOCUMENTATION.md for correct endpoint
- Verify backend is running
- Check that all routes are registered in backend

### 4. ECONNREFUSED

Backend is not running:
```bash
cd bus-tracking-backend
npm run dev
```

## Next Steps

1. Register demo users in the backend
2. Test login in the frontend
3. Update pages to use API instead of mock data
4. Deploy backend and frontend

See DEPLOYMENT.md for deployment instructions.
