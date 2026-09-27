const pool = require('../config/database')

// Get all bookings for a passenger
exports.getPassengerBookings = async (req, res) => {
  try {
    const { status } = req.query
    const passengerId = req.userId

    let query = `
      SELECT b.*, 
             bus.bus_number, bus.capacity,
             s.departure_time, s.arrival_time, s.schedule_date,
             r.start_location, r.end_location
      FROM bookings b
      JOIN buses bus ON b.bus_id = bus.id
      JOIN schedules s ON b.schedule_id = s.id
      JOIN routes r ON s.route_id = r.id
      WHERE b.passenger_id = $1
    `
    const params = [passengerId]

    if (status) {
      query += ' AND b.status = $2'
      params.push(status)
    }

    query += ' ORDER BY b.booking_date DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Get bookings error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT b.*, 
              bus.bus_number, bus.capacity,
              s.departure_time, s.arrival_time, s.schedule_date,
              r.start_location, r.end_location
       FROM bookings b
       JOIN buses bus ON b.bus_id = bus.id
       JOIN schedules s ON b.schedule_id = s.id
       JOIN routes r ON s.route_id = r.id
       WHERE b.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Get booking error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { schedule_id, bus_id, seats, total_price, journey_date } = req.body
    const passengerId = req.userId

    // Validate input
    if (!schedule_id || !bus_id || !seats || !total_price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if schedule exists
    const scheduleCheck = await pool.query(
      'SELECT available_seats FROM schedules WHERE id = $1',
      [schedule_id]
    )

    if (scheduleCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' })
    }

    // Create booking
    const result = await pool.query(
      `INSERT INTO bookings (passenger_id, schedule_id, bus_id, seats, total_price, journey_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [passengerId, schedule_id, bus_id, seats, total_price, journey_date, 'confirmed']
    )

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [passengerId, 'Booking Confirmed', 'Your bus ticket has been booked successfully', 'booking']
    )

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    })
  } catch (error) {
    console.error('Create booking error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params
    const passengerId = req.userId

    // Verify ownership
    const booking = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND passenger_id = $2',
      [id, passengerId]
    )

    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Cancel booking
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      ['cancelled', id]
    )

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [passengerId, 'Booking Cancelled', 'Your booking has been cancelled', 'booking']
    )

    res.json({ message: 'Booking cancelled successfully', booking: result.rows[0] })
  } catch (error) {
    console.error('Cancel booking error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Reschedule booking
exports.rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { new_schedule_id, new_journey_date } = req.body
    const passengerId = req.userId

    // Verify ownership
    const booking = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND passenger_id = $2',
      [id, passengerId]
    )

    if (booking.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Reschedule booking
    const result = await pool.query(
      'UPDATE bookings SET schedule_id = $1, journey_date = $2 WHERE id = $3 RETURNING *',
      [new_schedule_id, new_journey_date, id]
    )

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [passengerId, 'Booking Rescheduled', 'Your booking has been rescheduled successfully', 'booking']
    )

    res.json({ message: 'Booking rescheduled successfully', booking: result.rows[0] })
  } catch (error) {
    console.error('Reschedule booking error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, bus_id } = req.query

    let query = `
      SELECT b.*, 
             u.name, u.email,
             bus.bus_number,
             r.start_location, r.end_location
      FROM bookings b
      JOIN users u ON b.passenger_id = u.id
      JOIN buses bus ON b.bus_id = bus.id
      JOIN schedules s ON b.schedule_id = s.id
      JOIN routes r ON s.route_id = r.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND b.status = $' + (params.length + 1)
      params.push(status)
    }

    if (bus_id) {
      query += ' AND b.bus_id = $' + (params.length + 1)
      params.push(bus_id)
    }

    query += ' ORDER BY b.booking_date DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Get all bookings error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}
