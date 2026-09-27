const pool = require('../config/database')

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const { status } = req.query

    let query = 'SELECT * FROM buses'
    const params = []

    if (status) {
      query += ' WHERE status = $1'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Get buses error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get single bus with schedule
exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('SELECT * FROM buses WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' })
    }

    const bus = result.rows[0]

    // Get schedules for this bus
    const schedules = await pool.query(
      `SELECT s.*, r.start_location, r.end_location 
       FROM schedules s 
       JOIN routes r ON s.route_id = r.id 
       WHERE s.bus_id = $1`,
      [id]
    )

    res.json({ ...bus, schedules: schedules.rows })
  } catch (error) {
    console.error('Get bus error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Create bus (admin only)
exports.createBus = async (req, res) => {
  try {
    const { bus_number, capacity, company_name } = req.body

    if (!bus_number || !capacity) {
      return res.status(400).json({ error: 'Bus number and capacity are required' })
    }

    const result = await pool.query(
      'INSERT INTO buses (bus_number, capacity, company_name, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [bus_number, capacity, company_name || 'Express Bus', 'active']
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Create bus error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update bus (admin only)
exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params
    const { bus_number, capacity, company_name, status } = req.body

    const result = await pool.query(
      'UPDATE buses SET bus_number = $1, capacity = $2, company_name = $3, status = $4 WHERE id = $5 RETURNING *',
      [bus_number, capacity, company_name, status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Update bus error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete bus (admin only)
exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query('DELETE FROM buses WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bus not found' })
    }

    res.json({ message: 'Bus deleted successfully' })
  } catch (error) {
    console.error('Delete bus error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get GPS tracking for bus
exports.getBusLocation = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT latitude, longitude, speed, timestamp FROM gps_tracking WHERE bus_id = $1 ORDER BY timestamp DESC LIMIT 1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No location data found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Get location error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update GPS location (driver only)
exports.updateBusLocation = async (req, res) => {
  try {
    const { id } = req.params
    const { latitude, longitude, speed } = req.body

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' })
    }

    // Update current location in buses table
    await pool.query(
      'UPDATE buses SET current_latitude = $1, current_longitude = $2 WHERE id = $3',
      [latitude, longitude, id]
    )

    // Log to GPS tracking
    await pool.query(
      'INSERT INTO gps_tracking (bus_id, latitude, longitude, speed) VALUES ($1, $2, $3, $4)',
      [id, latitude, longitude, speed || 0]
    )

    res.json({ message: 'Location updated successfully' })
  } catch (error) {
    console.error('Update location error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get route history for a bus
exports.getBusRoute = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT latitude, longitude, speed, timestamp FROM gps_tracking WHERE bus_id = $1 ORDER BY timestamp DESC LIMIT 50',
      [id]
    )

    res.json(result.rows.reverse()) // Return chronological order
  } catch (error) {
    console.error('Get route error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}
