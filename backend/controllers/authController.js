const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const config = require('../config/config');
const { validationResult } = require('express-validator');

// Register a new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, role } = req.body;

  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, role]
    );

    // Create appropriate profile based on role
    const userId = result.insertId;
    if (role === 'sponsor') {
      await pool.query(
        'INSERT INTO sponsor_profiles (user_id) VALUES (?)',
        [userId]
      );
    } else if (role === 'receiver') {
      await pool.query(
        'INSERT INTO receiver_profiles (user_id) VALUES (?)',
        [userId]
      );
    }

    // Generate JWT token
    const payload = {
      user: {
        id: userId,
        role: role
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
      [user.user_id]
    );

    // Generate JWT token
    const payload = {
      user: {
        id: user.user_id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT user_id, email, first_name, last_name, role, created_at, last_login FROM users WHERE user_id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Change password
exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    // Get user from database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  
};
