const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// @route   GET api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get('/', auth, notificationController.getUserNotifications);

// @route   GET api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', auth, notificationController.getUnreadCount);

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, notificationController.markAsRead);

// @route   PUT api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// @route   POST api/notifications
// @desc    Create notification (admin only)
// @access  Private (Admin only)
router.post(
  '/',
  [
    auth,
    check('userId', 'User ID is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  notificationController.createNotification
);

// @route   DELETE api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, notificationController.deleteNotification);
// Get unread notifications count
router.get('/unread/count', auth, notificationController.getUnreadCount);
// Get all notifications
router.get('/', auth, notificationController.getNotifications);
module.exports = router;