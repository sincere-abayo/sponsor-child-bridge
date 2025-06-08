const pool = require('../config/database');
// Add this at the top of the file
const socket = require('../utils/socket');
const { validationResult } = require('express-validator');

// Get all notifications for current user
exports.getUserNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?`,
      [req.user.id, req.query.limit || 50]
    );

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
      [req.user.id]
    );

    res.json({ count: result[0].count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const [notification] = await pool.query(
      'SELECT * FROM notifications WHERE notification_id = ?',
      [req.params.id]
    );

    if (notification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user
    if (notification[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    await pool.query(
      'UPDATE notifications SET is_read = true WHERE notification_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false',
      [req.user.id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create notification (admin only)
exports.createNotification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Only admins can create notifications directly
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const { userId, title, message } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [userId, title, message]
    );

    const notification = {
      notification_id: result.insertId,
      user_id: userId,
      title,
      message,
      is_read: false,
      created_at: new Date()
    };

    // Send real-time notification
    socket.sendNotification(userId, notification);

    res.status(201).json({
      message: 'Notification created successfully',
      notificationId: result.insertId
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const [notification] = await pool.query(
      'SELECT * FROM notifications WHERE notification_id = ?',
      [req.params.id]
    );

    if (notification.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Check if notification belongs to user or user is admin
    if (notification[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }

    await pool.query(
      'DELETE FROM notifications WHERE notification_id = ?',
      [req.params.id]
    );

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
