const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { pool } = require('../config/database');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Add user from payload
    req.user = decoded.user;
    
    // Get user details from database
    const [users] = await pool.query(
      'SELECT first_name, last_name, email, role FROM users WHERE user_id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Add user details to req.user
    req.user.first_name = users[0].first_name;
    req.user.last_name = users[0].last_name;
    req.user.email = users[0].email;
    req.user.role = users[0].role;
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
