const pool = require('../config/database');
const { validationResult } = require('express-validator');

// Create a confirmation
exports.createConfirmation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sponsorshipId, notes } = req.body;
  const confirmedBy = req.user.id;
  let proofImage = null;

  if (req.file) {
    proofImage = req.file.filename;
  }

  try {
    // Check if sponsorship exists
    const [sponsorships] = await pool.query(
      'SELECT * FROM sponsorships WHERE sponsorship_id = ?',
      [sponsorshipId]
    );

    if (sponsorships.length === 0) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }

    const sponsorship = sponsorships[0];

    // Check if user is the receiver
    if (req.user.role !== 'admin' && req.user.id !== sponsorship.receiver_id) {
      return res.status(403).json({ message: 'Only the receiver can confirm receipt' });
    }

    // Check if already confirmed
    const [confirmations] = await pool.query(
      'SELECT * FROM confirmations WHERE sponsorship_id = ?',
      [sponsorshipId]
    );

    if (confirmations.length > 0) {
      return res.status(400).json({ message: 'This sponsorship has already been confirmed' });
    }

    // Create confirmation
    const [result] = await pool.query(
      'INSERT INTO confirmations (sponsorship_id, confirmed_by, proof_image, notes) VALUES (?, ?, ?, ?)',
      [sponsorshipId, confirmedBy, proofImage, notes]
    );

    // Update sponsorship status
    await pool.query(
      'UPDATE sponsorships SET status = ? WHERE sponsorship_id = ?',
      ['confirmed', sponsorshipId]
    );

    // Create notification for sponsor
    await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [
        sponsorship.sponsor_id,
        'Sponsorship Confirmed',
        `Your sponsorship has been confirmed by the receiver. Confirmation ID: ${result.insertId}`
      ]
    );

    res.status(201).json({
      message: 'Confirmation created successfully',
      confirmationId: result.insertId
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get confirmation by sponsorship ID
exports.getConfirmationBySponsorship = async (req, res) => {
  try {
    const [sponsorships] = await pool.query(
      'SELECT * FROM sponsorships WHERE sponsorship_id = ?',
      [req.params.sponsorshipId]
    );

    if (sponsorships.length === 0) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }

    const sponsorship = sponsorships[0];

    // Check if user is authorized
    if (req.user.role !== 'admin' && 
        req.user.id !== sponsorship.sponsor_id && 
        req.user.id !== sponsorship.receiver_id) {
      return res.status(403).json({ message: 'Not authorized to view this confirmation' });
    }

    const [confirmations] = await pool.query(
      `SELECT c.*, u.first_name, u.last_name 
      FROM confirmations c
      JOIN users u ON c.confirmed_by = u.user_id
      WHERE c.sponsorship_id = ?`,
      [req.params.sponsorshipId]
    );

    if (confirmations.length === 0) {
      return res.status(404).json({ message: 'Confirmation not found' });
    }

    res.json(confirmations[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};