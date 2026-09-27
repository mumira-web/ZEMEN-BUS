const pool = require('../config/database')

// Get all drivers (admin only)
exports.getAllDrivers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, status, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['driver']
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Get drivers error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get driver assigned trips
exports.getDriverTrips = async (req, res) => {
  try {
    const driverId = req.userId

    // Get driver's assigned buses - for this demo, we'll get recent schedules
    const result = await pool.query(
      `SELECT s.*, bus.bus_number, bus.capacity, r.start_location, r.end_location
       FROM schedules s
       JOIN buses bus ON s.bus_id = bus.id
       JOIN routes r ON s.route_id = r.id
       WHERE s.schedule_date >= CURRENT_DATE
       ORDER BY s.schedule_date DESC, s.departure_time ASC`,
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get driver trips error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Start trip (update status)
exports.startTrip = async (req, res) => {
  try {
    const { schedule_id, bus_id } = req.body
    const driverId = req.userId

    if (!schedule_id || !bus_id) {
      return res.status(400).json({ error: 'Schedule ID and Bus ID are required' })
    }

    // Verify bus exists
    const busCheck = await pool.query('SELECT * FROM buses WHERE id = $1', [bus_id])
    if (busCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' })
    }

    // Update bus status
    await pool.query(
      'UPDATE buses SET status = $1 WHERE id = $2',
      ['in_transit', bus_id]
    )

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [driverId, 'Trip Started', 'Your trip has started', 'trip']
    )

    res.json({ message: 'Trip started successfully' })
  } catch (error) {
    console.error('Start trip error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Complete trip
exports.completeTrip = async (req, res) => {
  try {
    const { bus_id } = req.body
    const driverId = req.userId

    if (!bus_id) {
      return res.status(400).json({ error: 'Bus ID is required' })
    }

    // Update bus status
    await pool.query(
      'UPDATE buses SET status = $1 WHERE id = $2',
      ['active', bus_id]
    )

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [driverId, 'Trip Completed', 'Your trip has been completed', 'trip']
    )

    res.json({ message: 'Trip completed successfully' })
  } catch (error) {
    console.error('Complete trip error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get passengers for a bus
exports.getBusPassengers = async (req, res) => {
  try {
    const { schedule_id, bus_id } = req.query

    if (!schedule_id || !bus_id) {
      return res.status(400).json({ error: 'Schedule ID and Bus ID are required' })
    }

    const result = await pool.query(
      `SELECT u.id, u.name, u.phone, b.seats, b.total_price
       FROM bookings b
       JOIN users u ON b.passenger_id = u.id
       WHERE b.schedule_id = $1 AND b.bus_id = $2 AND b.status = $3
       ORDER BY u.name ASC`,
      [schedule_id, bus_id, 'confirmed']
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get passengers error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update driver profile
exports.updateProfile = async (req, res) => {
  try {
    const driverId = req.userId
    const { name, phone } = req.body

    const result = await pool.query(
      'UPDATE users SET name = $1, phone = $2 WHERE id = $3 RETURNING id, email, name, phone, role',
      [name, phone, driverId]
    )

    res.json({ message: 'Profile updated successfully', user: result.rows[0] })
  } catch (error) {
    console.error('Update profile error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Create driver (admin only)
exports.createDriver = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body
    const bcrypt = require('bcrypt')

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Driver email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create driver
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, phone, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, role',
      [email, hashedPassword, name, phone || '', 'driver', 'active']
    )

    res.status(201).json({
      message: 'Driver created successfully',
      driver: result.rows[0]
    })
  } catch (error) {
    console.error('Create driver error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Suspend driver (admin only)
exports.suspendDriver = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 AND role = $3 RETURNING id, name, email, status',
      ['suspended', id, 'driver']
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' })
    }

    res.json({ message: 'Driver suspended successfully', driver: result.rows[0] })
  } catch (error) {
    console.error('Suspend driver error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Activate driver (admin only)
exports.activateDriver = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2 AND role = $3 RETURNING id, name, email, status',
      ['active', id, 'driver']
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' })
    }

    res.json({ message: 'Driver activated successfully', driver: result.rows[0] })
  } catch (error) {
    console.error('Activate driver error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}
