const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

// Register
router.post('/register', authController.register)

// Login
router.post('/login', authController.login)

// Get current user
router.get('/me', verifyToken, authController.getCurrentUser)

module.exports = router
