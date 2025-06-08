const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// @route   GET api/reports/sponsorship
// @desc    Generate sponsorship report
// @access  Private (Admin and Sponsors)
router.get('/sponsorship', auth, reportController.generateSponsorshipReport);

// @route   GET api/reports/financial
// @desc    Generate financial report
// @access  Private (Admin only)
router.get('/financial', auth, reportController.generateFinancialReport);

// @route   GET api/reports/activity
// @desc    Generate activity report
// @access  Private (Admin only)
router.get('/activity', auth, reportController.generateActivityReport);

// @route   GET api/reports
// @desc    Get all reports
// @access  Private
router.get('/', auth, reportController.getAllReports);

// @route   GET api/reports/:id
// @desc    Get report by ID
// @access  Private
router.get('/:id', auth, reportController.getReportById);

// @route   DELETE api/reports/:id
// @desc    Delete report
// @access  Private (Admin or report creator)
router.delete('/:id', auth, reportController.deleteReport);

// @route   GET api/reports/:id/export
// @desc    Export report to CSV
// @access  Private (Admin or report creator)
router.get('/:id/export', auth, reportController.exportReportToCsv);

module.exports = router;
