const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController')
const { verifyToken, requireRole } = require('../middleware/auth')

// Get user notifications
router.get('/', verifyToken, notificationController.getUserNotifications)

// Get unread count
router.get('/unread-count', verifyToken, notificationController.getUnreadCount)

// Mark notification as read
router.put('/:id/read', verifyToken, notificationController.markAsRead)

// Mark all as read
router.put('/all/read', verifyToken, notificationController.markAllAsRead)

// Delete notification
router.delete('/:id', verifyToken, notificationController.deleteNotification)

// Send notification to user (admin)
router.post('/', verifyToken, requireRole(['admin']), notificationController.sendNotification)

// Broadcast notification (admin)
router.post('/broadcast', verifyToken, requireRole(['admin']), notificationController.broadcastNotification)

module.exports = router
