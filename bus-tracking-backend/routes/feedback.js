const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')
const { verifyToken, requireRole } = require('../middleware/auth')

// Submit feedback
router.post('/', verifyToken, feedbackController.submitFeedback)

// Get user feedback
router.get('/my-feedback', verifyToken, feedbackController.getUserFeedback)

// Get feedback by ID
router.get('/:id', verifyToken, feedbackController.getFeedbackById)

// Get all feedback (admin)
router.get('/', verifyToken, requireRole(['admin']), feedbackController.getAllFeedback)

// Update feedback status (admin)
router.put('/:id', verifyToken, requireRole(['admin']), feedbackController.updateFeedbackStatus)

module.exports = router
