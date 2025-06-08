const pool = require('../config/database');
const { validationResult } = require('express-validator');
const socket = require('../utils/socket');

// Send a message
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { receiverId, subject, content } = req.body;
  const senderId = req.user.id;

  try {
    // Check if receiver exists
    const [receivers] = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [receiverId]
    );

    if (receivers.length === 0) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Insert message
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, subject, content) VALUES (?, ?, ?, ?)',
      [senderId, receiverId, subject, content]
    );

    // Create notification for receiver
    const [notificationResult] = await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [
        receiverId,
        'New Message',
        `You have received a new message from ${req.user.first_name} ${req.user.last_name}`
      ]
    );

    // Send real-time notification
    const notification = {
      notification_id: notificationResult.insertId,
      user_id: receiverId,
      title: 'New Message',
      message: `You have received a new message from ${req.user.first_name} ${req.user.last_name}`,
      is_read: false,
      created_at: new Date()
    };
    socket.sendNotification(receiverId, notification);

    res.status(201).json({
      message: 'Message sent successfully',
      messageId: result.insertId
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get received messages
exports.getReceivedMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, 
        u.first_name as sender_first_name, 
        u.last_name as sender_last_name,
        u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.receiver_id = ?
      ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get sent messages
exports.getSentMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, 
        u.first_name as receiver_first_name, 
        u.last_name as receiver_last_name,
        u.role as receiver_role
      FROM messages m
      JOIN users u ON m.receiver_id = u.user_id
      WHERE m.sender_id = ?
      ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get message by ID
exports.getMessageById = async (req, res) => {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, 
        s.first_name as sender_first_name, 
        s.last_name as sender_last_name,
        s.role as sender_role,
        r.first_name as receiver_first_name, 
        r.last_name as receiver_last_name,
        r.role as receiver_role
      FROM messages m
      JOIN users s ON m.sender_id = s.user_id
      JOIN users r ON m.receiver_id = r.user_id
      WHERE m.message_id = ?`,
      [req.params.id]
    );

    if (messages.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const message = messages[0];

    // Check if user is authorized to view this message
    if (req.user.role !== 'admin' && 
        req.user.id !== message.sender_id && 
        req.user.id !== message.receiver_id) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }

    // If user is the receiver and message is unread, mark as read
    if (req.user.id === message.receiver_id && !message.is_read) {
      await pool.query(
        'UPDATE messages SET is_read = true WHERE message_id = ?',
        [req.params.id]
      );
      message.is_read = true;
    }

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
      const [messages] = await pool.query(
        'SELECT * FROM messages WHERE message_id = ?',
        [req.params.id]
      );
  
      if (messages.length === 0) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      const message = messages[0];
  
      // Check if user is the receiver
      if (req.user.id !== message.receiver_id) {
        return res.status(403).json({ message: 'Not authorized to mark this message as read' });
      }
  
      // Mark as read
      await pool.query(
        'UPDATE messages SET is_read = true WHERE message_id = ?',
        [req.params.id]
      );
  
      res.json({ message: 'Message marked as read' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Delete message
  exports.deleteMessage = async (req, res) => {
    try {
      const [messages] = await pool.query(
        'SELECT * FROM messages WHERE message_id = ?',
        [req.params.id]
      );
  
      if (messages.length === 0) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      const message = messages[0];
  
      // Check if user is authorized to delete this message
      if (req.user.role !== 'admin' && 
          req.user.id !== message.sender_id && 
          req.user.id !== message.receiver_id) {
        return res.status(403).json({ message: 'Not authorized to delete this message' });
      }
  
      await pool.query(
        'DELETE FROM messages WHERE message_id = ?',
        [req.params.id]
      );
  
      res.json({ message: 'Message deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Get unread messages count
  exports.getUnreadCount = async (req, res) => {
    try {
      const [result] = await pool.query(
        'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = false',
        [req.user.id]
      );
  
      res.json({ count: result[0].count });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  