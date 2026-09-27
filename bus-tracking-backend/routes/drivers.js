const express = require('express')
const router = express.Router()
const driverController = require('../controllers/driverController')
const { verifyToken, requireRole } = require('../middleware/auth')

// Get all drivers (admin)
router.get('/', verifyToken, requireRole(['admin']), driverController.getAllDrivers)

// Get driver trips
router.get('/trips', verifyToken, requireRole(['driver']), driverController.getDriverTrips)

// Start trip
router.post('/trips/start', verifyToken, requireRole(['driver']), driverController.startTrip)

// Complete trip
router.post('/trips/complete', verifyToken, requireRole(['driver']), driverController.completeTrip)

// Get bus passengers
router.get('/passengers', verifyToken, requireRole(['driver']), driverController.getBusPassengers)

// Update driver profile
router.put('/profile', verifyToken, requireRole(['driver']), driverController.updateProfile)

// Create driver (admin)
router.post('/', verifyToken, requireRole(['admin']), driverController.createDriver)

// Suspend driver (admin)
router.put('/:id/suspend', verifyToken, requireRole(['admin']), driverController.suspendDriver)

// Activate driver (admin)
router.put('/:id/activate', verifyToken, requireRole(['admin']), driverController.activateDriver)

module.exports = router
