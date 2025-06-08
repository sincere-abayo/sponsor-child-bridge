const { validationResult } = require('express-validator');
const { pool } = require('../config/database');

// Get sponsor profile
exports.getSponsorProfile = async (req, res) => {
  try {
    const [profiles] = await pool.query(
      `SELECT u.user_id, u.email, u.first_name, u.last_name, u.role, u.created_at, u.last_login,
        sp.profile_id, sp.organization, sp.phone, sp.address, sp.city, sp.country, 
        sp.preferred_contact_method, sp.profile_image
      FROM users u
      JOIN sponsor_profiles sp ON u.user_id = sp.user_id
      WHERE u.user_id = ?`,
      [req.params.userId || req.user.id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // If not admin and not the profile owner, restrict access
    if (req.user.role !== 'admin' && req.user.id !== profiles[0].user_id) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    res.json(profiles[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update sponsor profile
exports.updateSponsorProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      organization,
      phone,
      address,
      city,
      country,
      preferredContactMethod
    } = req.body;
  
    try {
      // Check if profile exists
      const [profiles] = await pool.query(
        'SELECT * FROM sponsor_profiles WHERE user_id = ?',
        [req.user.id]
      );
  
      if (profiles.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Update profile
      await pool.query(
        `UPDATE sponsor_profiles 
        SET organization = ?, phone = ?, address = ?, city = ?, country = ?, preferred_contact_method = ?
        WHERE user_id = ?`,
        [organization, phone, address, city, country, preferredContactMethod, req.user.id]
      );
  
      // If there's a profile image update
      if (req.file) {
        await pool.query(
          'UPDATE sponsor_profiles SET profile_image = ? WHERE user_id = ?',
          [req.file.filename, req.user.id]
        );
      }
  
      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Get receiver profile
exports.getReceiverProfile = async (req, res) => {
    try {
      const [profiles] = await pool.query(
        `SELECT u.user_id, u.email, u.first_name, u.last_name, u.role, u.created_at, u.last_login,
          rp.profile_id, rp.date_of_birth, rp.guardian_name, rp.guardian_contact, 
          rp.school_class, rp.interests, rp.needs, rp.profile_image
        FROM users u
        JOIN receiver_profiles rp ON u.user_id = rp.user_id
        WHERE u.user_id = ?`,
        [req.params.userId || req.user.id]
      );
  
      if (profiles.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // If not admin and not the profile owner, restrict access
      if (req.user.role !== 'admin' && req.user.id !== profiles[0].user_id) {
        return res.status(403).json({ message: 'Not authorized to view this profile' });
      }
  
      res.json(profiles[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Update receiver profile
  exports.updateReceiverProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {
      dateOfBirth,
      guardianName,
      guardianContact,
      schoolClass,
      interests,
      needs
    } = req.body;
  
    try {
      // Check if profile exists
      const [profiles] = await pool.query(
        'SELECT * FROM receiver_profiles WHERE user_id = ?',
        [req.user.id]
      );
  
      if (profiles.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Update profile
      await pool.query(
        `UPDATE receiver_profiles 
        SET date_of_birth = ?, guardian_name = ?, guardian_contact = ?, 
        school_class = ?, interests = ?, needs = ?
        WHERE user_id = ?`,
        [dateOfBirth, guardianName, guardianContact, schoolClass, interests, needs, req.user.id]
      );
  
      // If there's a profile image update
      if (req.file) {
        await pool.query(
          'UPDATE receiver_profiles SET profile_image = ? WHERE user_id = ?',
          [req.file.filename, req.user.id]
        );
      }
  
      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Get all receivers (for sponsors to browse)
  exports.getAllReceivers = async (req, res) => {
    try {
      const [receivers] = await pool.query(
        `SELECT u.user_id, u.first_name, u.last_name, 
          rp.school_class, rp.interests, rp.needs, rp.profile_image
        FROM users u
        JOIN receiver_profiles rp ON u.user_id = rp.user_id
        WHERE u.role = 'receiver' AND u.is_active = true
        ORDER BY u.first_name, u.last_name`
      );
  
      res.json(receivers);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Upload profile image
  exports.uploadProfileImage = async (req, res) => {
    // Debug information
    console.log('File upload request received');
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ message: 'No image file provided' });
    }
  
    try {
      const { role } = req.user;
      let table = '';
  
      if (role === 'sponsor') {
        table = 'sponsor_profiles';
      } else if (role === 'receiver') {
        table = 'receiver_profiles';
      } else {
        console.log('Invalid role:', role);
        return res.status(400).json({ message: 'Invalid user role for profile image upload' });
      }
  
      console.log('Updating profile image in table:', table);
      
      // Update profile image
      await pool.query(
        `UPDATE ${table} SET profile_image = ? WHERE user_id = ?`,
        [req.file.filename, req.user.id]
      );
  
      console.log('Profile image updated successfully');
      
      res.json({ 
        message: 'Profile image uploaded successfully',
        filename: req.file.filename
      });
    } catch (err) {
      console.error('Profile image upload error:', err.message);
      res.status(500).send('Server error');
    }
  };
  