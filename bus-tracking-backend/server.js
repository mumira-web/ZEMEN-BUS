const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
const authRoutes = require('./routes/auth')
const busRoutes = require('./routes/buses')
const bookingRoutes = require('./routes/bookings')
const driverRoutes = require('./routes/drivers')
const feedbackRoutes = require('./routes/feedback')
const notificationRoutes = require('./routes/notifications')

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/buses', busRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/notifications', notificationRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bus Tracking & Ticketing System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      buses: '/api/buses',
      bookings: '/api/bookings',
      drivers: '/api/drivers',
      feedback: '/api/feedback',
      notifications: '/api/notifications'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})
