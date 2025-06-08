const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const confirmationController = require('../controllers/confirmationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST api/confirmations
// @desc    Create a confirmation
// @access  Private (Receivers only)
router.post(
  '/',
  [
    auth,
    upload.single('proofImage'),
    check('sponsorshipId', 'Sponsorship ID is required').not().isEmpty()
  ],
  confirmationController.createConfirmation
);

// @route   GET api/confirmations/sponsorship/:sponsorshipId
// @desc    Get confirmation by sponsorship ID
// @access  Private
router.get(
  '/sponsorship/:sponsorshipId',
  auth,
  confirmationController.getConfirmationBySponsorship
);

module.exports = router;