const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const sponsorshipController = require('../controllers/sponsorshipController');
const auth = require('../middleware/auth');

// @route   POST api/sponsorships
// @desc    Create a new sponsorship
// @access  Private (Sponsors only)
router.post(
  '/',
  [
    auth,
    check('receiverId', 'Receiver ID is required').not().isEmpty(),
    check('amount', 'Amount is required and must be a number').isNumeric(),
    check('startDate', 'Start date is required').not().isEmpty(),
    check('frequency', 'Frequency must be valid').isIn(['one-time', 'monthly', 'quarterly', 'annually'])
  ],
  sponsorshipController.createSponsorship
);

// @route   GET api/sponsorships/sponsor
// @desc    Get all sponsorships for logged in sponsor
// @access  Private (Sponsors only)
router.get('/sponsor', auth, sponsorshipController.getSponsorSponsorships);

// @route   GET api/sponsorships/receiver
// @desc    Get all sponsorships for logged in receiver
// @access  Private (Receivers only)
router.get('/receiver', auth, sponsorshipController.getReceiverSponsorships);

// @route   GET api/sponsorships/:id
// @desc    Get a specific sponsorship by ID
// @access  Private
router.get('/:id', auth, sponsorshipController.getSponsorshipById);

// @route   PUT api/sponsorships/:id/status
// @desc    Update sponsorship status
// @access  Private
router.put(
  '/:id/status',
  [
    auth,
    check('status', 'Status is required').isIn(['pending', 'active', 'confirmed', 'completed', 'cancelled'])
  ],
  sponsorshipController.updateSponsorshipStatus
);

module.exports = router;