const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET api/sponsors/profile
// @desc    Get current sponsor profile
// @access  Private (Sponsors only)
router.get(
  '/profile',
  auth,
  profileController.getSponsorProfile
);

// @route   GET api/sponsors/profile/:userId
// @desc    Get sponsor profile by user ID
// @access  Private
router.get(
  '/profile/:userId',
  auth,
  profileController.getSponsorProfile
);

// @route   PUT api/sponsors/profile
// @desc    Update sponsor profile
// @access  Private (Sponsors only)
router.put(
  '/profile',
  [
    auth,
    check('phone', 'Phone number is invalid').optional().isMobilePhone(),
    check('preferredContactMethod', 'Invalid contact method').optional().isIn(['email', 'phone', 'system'])
  ],
  profileController.updateSponsorProfile
);

// @route   POST api/sponsors/profile/image
// @desc    Upload profile image
// @access  Private (Sponsors only)
router.post(
  '/profile/image',
  [auth, upload.single('profileImage')],
  profileController.uploadProfileImage
);


module.exports = router;