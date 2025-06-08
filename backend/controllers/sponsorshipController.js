const pool = require('../config/database');
const { validationResult } = require('express-validator');

// Create a new sponsorship
exports.createSponsorship = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { receiverId, amount, currency, purpose, startDate, endDate, frequency } = req.body;
  const sponsorId = req.user.id;

  try {
    // Insert sponsorship record
    const [result] = await pool.query(
      `INSERT INTO sponsorships 
      (sponsor_id, receiver_id, amount, currency, purpose, start_date, end_date, frequency) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sponsorId, receiverId, amount, currency, purpose, startDate, endDate, frequency]
    );

    // Create notification for receiver
    await pool.query(
      `INSERT INTO notifications (user_id, title, message) 
      VALUES (?, ?, ?)`,
      [
        receiverId, 
        'New Sponsorship Received', 
        `You have received a new sponsorship of ${amount} ${currency}. Please confirm receipt.`
      ]
    );

    res.status(201).json({
      message: 'Sponsorship created successfully',
      sponsorshipId: result.insertId
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all sponsorships for a sponsor
exports.getSponsorSponsorships = async (req, res) => {
  try {
    const [sponsorships] = await pool.query(
      `SELECT s.*, 
        u.first_name as receiver_first_name, 
        u.last_name as receiver_last_name,
        c.confirmation_id,
        c.confirmation_date,
        c.proof_image
      FROM sponsorships s
      JOIN users u ON s.receiver_id = u.user_id
      LEFT JOIN confirmations c ON s.sponsorship_id = c.sponsorship_id
      WHERE s.sponsor_id = ?
      ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.json(sponsorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all sponsorships for a receiver
exports.getReceiverSponsorships = async (req, res) => {
  try {
    const [sponsorships] = await pool.query(
      `SELECT s.*, 
        u.first_name as sponsor_first_name, 
        u.last_name as sponsor_last_name,
        c.confirmation_id,
        c.confirmation_date,
        c.proof_image
      FROM sponsorships s
      JOIN users u ON s.sponsor_id = u.user_id
      LEFT JOIN confirmations c ON s.sponsorship_id = c.sponsorship_id
      WHERE s.receiver_id = ?
      ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.json(sponsorships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a specific sponsorship by ID
exports.getSponsorshipById = async (req, res) => {
  try {
    const [sponsorships] = await pool.query(
      `SELECT s.*, 
        sp.first_name as sponsor_first_name, 
        sp.last_name as sponsor_last_name,
        rc.first_name as receiver_first_name, 
        rc.last_name as receiver_last_name,
        c.confirmation_id,
        c.confirmation_date,
        c.proof_image,
        c.notes
      FROM sponsorships s
      JOIN users sp ON s.sponsor_id = sp.user_id
      JOIN users rc ON s.receiver_id = rc.user_id
      LEFT JOIN confirmations c ON s.sponsorship_id = c.sponsorship_id
      WHERE s.sponsorship_id = ?`,
      [req.params.id]
    );

    if (sponsorships.length === 0) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }

    // Check if user is authorized to view this sponsorship
    const sponsorship = sponsorships[0];
    if (req.user.role !== 'admin' && 
        req.user.id !== sponsorship.sponsor_id && 
        req.user.id !== sponsorship.receiver_id) {
      return res.status(403).json({ message: 'Not authorized to view this sponsorship' });
    }

    res.json(sponsorship);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update sponsorship status
exports.updateSponsorshipStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status } = req.body;

  try {
    // Check if sponsorship exists and user is authorized
    const [sponsorships] = await pool.query(
      'SELECT * FROM sponsorships WHERE sponsorship_id = ?',
      [req.params.id]
    );

    if (sponsorships.length === 0) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }

    const sponsorship = sponsorships[0];
    
    // Only admin, sponsor, or receiver can update status
    if (req.user.role !== 'admin' && 
        req.user.id !== sponsorship.sponsor_id && 
        req.user.id !== sponsorship.receiver_id) {
      return res.status(403).json({ message: 'Not authorized to update this sponsorship' });
    }

    // Update status
    await pool.query(
      'UPDATE sponsorships SET status = ? WHERE sponsorship_id = ?',
      [status, req.params.id]
    );

    res.json({ message: 'Sponsorship status updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};