# Bus Tracking & Ticketing System - Backend

Complete Node.js + Express + PostgreSQL backend for the Bus Tracking and Ticketing System.

## Features

- User Authentication (JWT-based)
- Three User Roles: Passenger, Driver, Admin
- Bus Management & GPS Tracking
- Booking & Ticketing System
- Driver Trip Management
- Passenger Feedback System
- Real-time Notifications
- Role-based Access Control (RBAC)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing

## Quick Start

### 1. Prerequisites
- Node.js v14+
- PostgreSQL v12+
- npm or yarn

### 2. Installation

```bash
# Clone repository
git clone <repo-url>
cd bus-tracking-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
nano .env
```

### 3. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres

# In psql:
CREATE DATABASE bus_tracking;
\c bus_tracking
\i db/schema.sql
\q
```

### 4. Start Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on: `http://localhost:5000`

### 5. Test API

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"User","role":"passenger"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

## Project Structure

```
bus-tracking-backend/
├── server.js                          # Main server
├── package.json                       # Dependencies
├── .env                               # Environment variables
├── config/
│   └── database.js                    # DB connection
├── middleware/
│   └── auth.js                        # JWT verification
├── controllers/
│   ├── authController.js              # Auth logic
│   ├── busController.js               # Bus operations
│   ├── bookingController.js           # Booking logic
│   ├── driverController.js            # Driver operations
│   ├── feedbackController.js          # Feedback handling
│   └── notificationController.js      # Notifications
├── routes/
│   ├── auth.js                        # Auth endpoints
│   ├── buses.js                       # Bus endpoints
│   ├── bookings.js                    # Booking endpoints
│   ├── drivers.js                     # Driver endpoints
│   ├── feedback.js                    # Feedback endpoints
│   └── notifications.js               # Notification endpoints
├── db/
│   └── schema.sql                     # Database schema
└── docs/
    ├── API_DOCUMENTATION.md           # Full API docs
    ├── SETUP_GUIDE.md                 # Setup instructions
    └── DEPLOYMENT.md                  # Deployment guide
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Buses
- `GET /api/buses` - List all buses
- `GET /api/buses/:id` - Get bus details
- `POST /api/buses` - Create bus (admin)
- `POST /api/buses/:id/location` - Update GPS (driver)
- `GET /api/buses/:id/location` - Get current location
- `GET /api/buses/:id/route` - Get route history

### Bookings
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/reschedule` - Reschedule booking

### Drivers
- `GET /api/drivers/trips` - Get driver trips
- `POST /api/drivers/trips/start` - Start trip
- `POST /api/drivers/trips/complete` - Complete trip
- `GET /api/drivers/passengers` - Get passengers

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/my-feedback` - Get user feedback
- `GET /api/feedback` - Get all feedback (admin)
- `PUT /api/feedback/:id` - Update status (admin)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `POST /api/notifications` - Send notification (admin)
- `POST /api/notifications/broadcast` - Broadcast (admin)

See **API_DOCUMENTATION.md** for complete details.

## Environment Variables

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bus_tracking

JWT_SECRET=your_secret_key

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

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

## Scripts

```bash
npm run dev       # Start with nodemon (development)
npm start         # Start production server
```

## Database Schema

Tables:
- `users` - User accounts
- `buses` - Bus fleet
- `routes` - Bus routes
- `schedules` - Bus schedules
- `bookings` - User bookings
- `gps_tracking` - GPS data
- `feedback` - User feedback
- `notifications` - User notifications

See `db/schema.sql` for full schema.

## Deployment

Supported platforms:
- **Heroku** (recommended) - See DEPLOYMENT.md
- **Railway**
- **DigitalOcean**
- **AWS EC2**

One-click deployment instructions provided in DEPLOYMENT.md

## Security Features

- JWT token-based authentication
- bcrypt password hashing
- Role-based access control (RBAC)
- Input validation
- CORS configuration
- Environment variable protection

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message here"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Rate Limiting (Future)

Consider adding rate limiting for production:
```bash
npm install express-rate-limit
```

## Monitoring (Future)

Add error tracking:
```bash
npm install @sentry/node
```

## Contributing

1. Clone repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Support

For issues or questions:
1. Check SETUP_GUIDE.md for setup help
2. Review API_DOCUMENTATION.md for API details
3. See DEPLOYMENT.md for deployment help

## License

MIT

## Connect Frontend

In frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then update frontend API calls to use this URL instead of mock data.

---

**Ready to deploy? See DEPLOYMENT.md**
