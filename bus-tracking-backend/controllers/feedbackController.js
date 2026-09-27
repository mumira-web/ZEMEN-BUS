const pool = require('../config/database')

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { bus_id, rating, comment } = req.body
    const passengerId = req.userId

    if (!bus_id || !rating) {
      return res.status(400).json({ error: 'Bus ID and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const result = await pool.query(
      'INSERT INTO feedback (passenger_id, bus_id, rating, comment, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [passengerId, bus_id, rating, comment || '', 'pending']
    )

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: result.rows[0]
    })
  } catch (error) {
    console.error('Submit feedback error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user feedback
exports.getUserFeedback = async (req, res) => {
  try {
    const passengerId = req.userId

    const result = await pool.query(
      `SELECT f.*, bus.bus_number 
       FROM feedback f
       JOIN buses bus ON f.bus_id = bus.id
       WHERE f.passenger_id = $1
       ORDER BY f.created_at DESC`,
      [passengerId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get user feedback error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get all feedback (admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const { status } = req.query

    let query = `
      SELECT f.*, u.name, u.email, bus.bus_number
      FROM feedback f
      JOIN users u ON f.passenger_id = u.id
      JOIN buses bus ON f.bus_id = bus.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND f.status = $' + (params.length + 1)
      params.push(status)
    }

    query += ' ORDER BY f.created_at DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Get all feedback error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update feedback status (admin only)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, admin_notes } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const result = await pool.query(
      'UPDATE feedback SET status = $1, admin_notes = $2 WHERE id = $3 RETURNING *',
      [status, admin_notes || '', id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' })
    }

    res.json({
      message: 'Feedback status updated',
      feedback: result.rows[0]
    })
  } catch (error) {
    console.error('Update feedback error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT f.*, u.name, u.email, bus.bus_number
       FROM feedback f
       JOIN users u ON f.passenger_id = u.id
       JOIN buses bus ON f.bus_id = bus.id
       WHERE f.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Get feedback error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}
