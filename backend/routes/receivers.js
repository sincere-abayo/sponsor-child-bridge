const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/receivers
// @desc    Get all receivers
// @access  Private
router.get('/', auth, profileController.getAllReceivers);

// @route   GET api/receivers/profile
// @desc    Get current receiver profile
// @access  Private (Receivers only)
router.get(
  '/profile',
  auth,
  profileController.getReceiverProfile
);

// @route   GET api/receivers/profile/:userId
// @desc    Get receiver profile by user ID
// @access  Private
router.get(
  '/profile/:userId',
  auth,
  profileController.getReceiverProfile
);

// @route   PUT api/receivers/profile
// @desc    Update receiver profile
// @access  Private (Receivers only)
router.put(
  '/profile',
  [
    auth,
    check('guardianContact', 'Guardian contact is invalid').optional().isMobilePhone()
  ],
  profileController.updateReceiverProfile
);

// @route   POST api/receivers/profile/image
// @desc    Upload profile image
// @access  Private (Receivers only)
router.post(
  '/profile/image',
  [auth, upload.single('profileImage')],
  profileController.uploadProfileImage
);

module.exports = router;