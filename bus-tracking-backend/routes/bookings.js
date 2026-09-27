const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const { verifyToken, requireRole } = require('../middleware/auth')

// Get passenger bookings
router.get('/my-bookings', verifyToken, bookingController.getPassengerBookings)

// Get single booking
router.get('/:id', verifyToken, bookingController.getBookingById)

// Create booking
router.post('/', verifyToken, requireRole(['passenger']), bookingController.createBooking)

// Cancel booking
router.put('/:id/cancel', verifyToken, requireRole(['passenger']), bookingController.cancelBooking)

// Reschedule booking
router.put('/:id/reschedule', verifyToken, requireRole(['passenger']), bookingController.rescheduleBooking)

// Get all bookings (admin)
router.get('/', verifyToken, requireRole(['admin']), bookingController.getAllBookings)

module.exports = router
