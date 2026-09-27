const express = require('express')
const router = express.Router()
const busController = require('../controllers/busController')
const { verifyToken, requireRole } = require('../middleware/auth')

// Get all buses
router.get('/', busController.getAllBuses)

// Get single bus
router.get('/:id', busController.getBusById)

// Create bus (admin only)
router.post('/', verifyToken, requireRole(['admin']), busController.createBus)

// Update bus (admin only)
router.put('/:id', verifyToken, requireRole(['admin']), busController.updateBus)

// Delete bus (admin only)
router.delete('/:id', verifyToken, requireRole(['admin']), busController.deleteBus)

// Get current location
router.get('/:id/location', busController.getBusLocation)

// Update GPS location (driver only)
router.post('/:id/location', verifyToken, requireRole(['driver']), busController.updateBusLocation)

// Get route history
router.get('/:id/route', busController.getBusRoute)

module.exports = router
