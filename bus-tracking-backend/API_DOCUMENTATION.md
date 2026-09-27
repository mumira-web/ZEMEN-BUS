# Bus Tracking & Ticketing System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. AUTHENTICATION ENDPOINTS

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+251912345678",
  "role": "passenger"  // or "driver", "admin"
}

Response: 201
{
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "passenger"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "passenger"
  }
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <JWT_TOKEN>

Response: 200
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+251912345678",
  "role": "passenger"
}
```

---

## 2. BUSES ENDPOINTS

### Get All Buses
```
GET /buses?status=active
Response: 200
[
  {
    "id": 1,
    "bus_number": "BUS-001",
    "capacity": 50,
    "status": "active",
    "company_name": "Express Bus",
    "current_latitude": 9.0320,
    "current_longitude": 38.7469
  }
]
```

### Get Single Bus with Schedules
```
GET /buses/:id
Response: 200
{
  "id": 1,
  "bus_number": "BUS-001",
  "capacity": 50,
  "status": "active",
  "schedules": [
    {
      "id": 1,
      "departure_time": "08:00:00",
      "arrival_time": "14:00:00",
      "start_location": "Addis Ababa",
      "end_location": "Dire Dawa"
    }
  ]
}
```

### Create Bus (Admin Only)
```
POST /buses
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "bus_number": "BUS-002",
  "capacity": 50,
  "company_name": "Express Bus"
}

Response: 201
```

### Update GPS Location (Driver Only)
```
POST /buses/:id/location
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "latitude": 9.0320,
  "longitude": 38.7469,
  "speed": 60
}

Response: 200
{
  "message": "Location updated successfully"
}
```

### Get Current Location
```
GET /buses/:id/location
Response: 200
{
  "latitude": 9.0320,
  "longitude": 38.7469,
  "speed": 60,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Route History
```
GET /buses/:id/route
Response: 200
[
  {
    "latitude": 9.0320,
    "longitude": 38.7469,
    "speed": 60,
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

---

## 3. BOOKINGS ENDPOINTS

### Get User Bookings
```
GET /bookings/my-bookings?status=confirmed
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  {
    "id": 1,
    "bus_number": "BUS-001",
    "seats": "[1, 2]",
    "total_price": 1000,
    "status": "confirmed",
    "start_location": "Addis Ababa",
    "end_location": "Dire Dawa"
  }
]
```

### Create Booking (Passenger Only)
```
POST /bookings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "schedule_id": 1,
  "bus_id": 1,
  "seats": "[1, 2]",
  "total_price": 1000,
  "journey_date": "2024-01-20"
}

Response: 201
{
  "message": "Booking created successfully",
  "booking": { ... }
}
```

### Cancel Booking (Passenger Only)
```
PUT /bookings/:id/cancel
Authorization: Bearer <JWT_TOKEN>

Response: 200
{
  "message": "Booking cancelled successfully",
  "booking": { ... }
}
```

### Reschedule Booking (Passenger Only)
```
PUT /bookings/:id/reschedule
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "new_schedule_id": 2,
  "new_journey_date": "2024-01-21"
}

Response: 200
```

### Get All Bookings (Admin Only)
```
GET /bookings?status=confirmed&bus_id=1
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  { ... }
]
```

---

## 4. DRIVERS ENDPOINTS

### Get Driver Trips (Driver Only)
```
GET /drivers/trips
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  {
    "id": 1,
    "bus_number": "BUS-001",
    "departure_time": "08:00:00",
    "start_location": "Addis Ababa",
    "end_location": "Dire Dawa"
  }
]
```

### Start Trip (Driver Only)
```
POST /drivers/trips/start
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "schedule_id": 1,
  "bus_id": 1
}

Response: 200
{
  "message": "Trip started successfully"
}
```

### Complete Trip (Driver Only)
```
POST /drivers/trips/complete
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "bus_id": 1
}

Response: 200
```

### Get Bus Passengers (Driver Only)
```
GET /drivers/passengers?schedule_id=1&bus_id=1
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  {
    "id": 1,
    "name": "John Doe",
    "phone": "+251912345678",
    "seats": "[1, 2]"
  }
]
```

### Get All Drivers (Admin Only)
```
GET /drivers
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  {
    "id": 1,
    "name": "Driver Name",
    "email": "driver@example.com",
    "phone": "+251912345678",
    "status": "active"
  }
]
```

### Create Driver (Admin Only)
```
POST /drivers
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "email": "driver@example.com",
  "password": "password123",
  "name": "Driver Name",
  "phone": "+251912345678"
}

Response: 201
```

### Suspend Driver (Admin Only)
```
PUT /drivers/:id/suspend
Authorization: Bearer <JWT_TOKEN>

Response: 200
```

### Activate Driver (Admin Only)
```
PUT /drivers/:id/activate
Authorization: Bearer <JWT_TOKEN>

Response: 200
```

---

## 5. FEEDBACK ENDPOINTS

### Submit Feedback (Passenger Only)
```
POST /feedback
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "bus_id": 1,
  "rating": 5,
  "comment": "Great service!"
}

Response: 201
```

### Get User Feedback (Passenger Only)
```
GET /feedback/my-feedback
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  {
    "id": 1,
    "bus_number": "BUS-001",
    "rating": 5,
    "comment": "Great service!",
    "status": "pending"
  }
]
```

### Get All Feedback (Admin Only)
```
GET /feedback?status=pending
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  { ... }
]
```

### Update Feedback Status (Admin Only)
```
PUT /feedback/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "status": "resolved",
  "admin_notes": "Issue addressed"
}

Response: 200
```

---

## 6. NOTIFICATIONS ENDPOINTS

### Get User Notifications
```
GET /notifications
Authorization: Bearer <JWT_TOKEN>

Response: 200
[
  {
    "id": 1,
    "title": "Booking Confirmed",
    "message": "Your bus ticket has been booked successfully",
    "type": "booking",
    "is_read": false,
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### Get Unread Count
```
GET /notifications/unread-count
Authorization: Bearer <JWT_TOKEN>

Response: 200
{
  "unread_count": 3
}
```

### Mark Notification as Read
```
PUT /notifications/:id/read
Authorization: Bearer <JWT_TOKEN>

Response: 200
```

### Mark All as Read
```
PUT /notifications/all/read
Authorization: Bearer <JWT_TOKEN>

Response: 200
```

### Send Notification to User (Admin Only)
```
POST /notifications
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "user_id": 1,
  "title": "System Maintenance",
  "message": "Maintenance scheduled for tonight",
  "type": "alert"
}

Response: 201
```

### Broadcast Notification (Admin Only)
```
POST /notifications/broadcast
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "role": "passenger",
  "title": "New Features",
  "message": "Check out our new features!",
  "type": "announcement"
}

Response: 201
{
  "message": "Notification broadcast to 150 passengers",
  "recipients_count": 150
}
```

### Delete Notification
```
DELETE /notifications/:id
Authorization: Bearer <JWT_TOKEN>

Response: 200
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Required role: admin"
}
```

### 404 Not Found
```json
{
  "error": "Bus not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error"
}
```

---

## Test Credentials

```
Admin:
email: admin@test.com
password: demo123

Driver:
email: driver@test.com
password: demo123

Passenger:
email: passenger@test.com
password: demo123
```
