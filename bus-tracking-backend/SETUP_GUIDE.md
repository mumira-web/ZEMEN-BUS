# Bus Tracking Backend - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

---

## Step 1: Install PostgreSQL

### On Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember your password for the `postgres` user

### On Mac
```bash
brew install postgresql
```

### On Linux
```bash
sudo apt-get install postgresql postgresql-contrib
```

---

## Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bus_tracking;

# Connect to database
\c bus_tracking

# Exit
\q
```

---

## Step 3: Setup Backend Project

```bash
# Clone/navigate to backend folder
cd bus-tracking-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
```

### Update .env file:
```
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bus_tracking

JWT_SECRET=your_super_secret_key_change_this_in_production

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

---

## Step 4: Create Database Schema

```bash
# Connect to database and run schema
psql -U postgres -d bus_tracking -f db/schema.sql
```

Or manually:
```bash
psql -U postgres
\c bus_tracking
\i db/schema.sql
```

---

## Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
Server running on http://localhost:5000
Environment: development
Frontend URL: http://localhost:3000
```

---

## Step 6: Test Backend

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running","timestamp":"2024-01-15T10:00:00.000Z"}
```

---

## Step 7: Connect Frontend to Backend

In your frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Step 8: Create Test Users

```bash
# Use API to register test users
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "passenger@test.com",
    "password": "demo123",
    "name": "Passenger User",
    "role": "passenger"
  }'

# Driver
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@test.com",
    "password": "demo123",
    "name": "Driver User",
    "role": "driver"
  }'

# Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "demo123",
    "name": "Admin User",
    "role": "admin"
  }'
```

---

## Troubleshooting

### Error: "Database connection failed"
- Check PostgreSQL is running: `psql -U postgres`
- Verify .env credentials are correct
- Ensure database exists: `psql -U postgres -l`

### Error: "Port 5000 already in use"
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Error: "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### JWT token errors
- Check JWT_SECRET in .env is set
- Ensure token is in Authorization header: `Bearer <token>`

---

## Directory Structure

```
bus-tracking-backend/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── config/
│   └── database.js          # Database connection
├── controllers/             # Business logic
│   ├── authController.js
│   ├── busController.js
│   ├── bookingController.js
│   ├── driverController.js
│   ├── feedbackController.js
│   └── notificationController.js
├── routes/                  # API endpoints
│   ├── auth.js
│   ├── buses.js
│   ├── bookings.js
│   ├── drivers.js
│   ├── feedback.js
│   └── notifications.js
├── middleware/              # Custom middleware
│   └── auth.js              # JWT verification
├── db/
│   └── schema.sql           # Database schema
└── docs/
    ├── API_DOCUMENTATION.md
    └── SETUP_GUIDE.md
```

---

## Next Steps

1. **Frontend Integration** - Update frontend to use backend APIs
2. **Deployment** - Deploy backend to production (see DEPLOYMENT.md)
3. **Testing** - Run API tests with Postman or similar tool
4. **Monitoring** - Setup logging and monitoring

---

## Quick Test Commands

```bash
# Test endpoints with curl

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get buses
curl http://localhost:5000/api/buses

# Get health
curl http://localhost:5000/api/health
```

---

For more details, see API_DOCUMENTATION.md
