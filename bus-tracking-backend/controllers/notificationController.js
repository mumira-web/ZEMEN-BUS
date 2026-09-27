const pool = require('../config/database')

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId

    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Get notifications error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const result = await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    res.json({ message: 'Notification marked as read', notification: result.rows[0] })
  } catch (error) {
    console.error('Mark as read error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId

    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1',
      [userId]
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all as read error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId

    const result = await pool.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    )

    res.json({ unread_count: parseInt(result.rows[0].count) })
  } catch (error) {
    console.error('Get unread count error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Send notification to user (admin only)
exports.sendNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body

    if (!user_id || !title || !message) {
      return res.status(400).json({ error: 'User ID, title, and message are required' })
    }

    const result = await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, title, message, type || 'general']
    )

    res.status(201).json({
      message: 'Notification sent',
      notification: result.rows[0]
    })
  } catch (error) {
    console.error('Send notification error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Broadcast notification to all users of a role (admin only)
exports.broadcastNotification = async (req, res) => {
  try {
    const { role, title, message, type } = req.body

    if (!role || !title || !message) {
      return res.status(400).json({ error: 'Role, title, and message are required' })
    }

    // Get all users with the specified role
    const users = await pool.query(
      'SELECT id FROM users WHERE role = $1',
      [role]
    )

    // Send notification to each user
    for (const user of users.rows) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)',
        [user.id, title, message, type || 'general']
      )
    }

    res.status(201).json({
      message: `Notification broadcast to ${users.rows.length} ${role}s`,
      recipients_count: users.rows.length
    })
  } catch (error) {
    console.error('Broadcast notification error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const result = await pool.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' })
    }

    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Delete notification error:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
}
