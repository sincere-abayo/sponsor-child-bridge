const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('role', 'Role must be sponsor, receiver, or admin').isIn(['sponsor', 'receiver', 'admin'])
  ],
  authController.register
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// @route   PUT api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  [
    auth,
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.changePassword
);
// Get current user
router.get('/user', auth, authController.getCurrentUser);

module.exports = router;