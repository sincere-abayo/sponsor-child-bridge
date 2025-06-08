const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post(
  '/',
  [
    auth,
    check('receiverId', 'Receiver ID is required').not().isEmpty(),
    check('content', 'Message content is required').not().isEmpty()
  ],
  messageController.sendMessage
);

// @route   GET api/messages/received
// @desc    Get received messages
// @access  Private
router.get('/received', auth, messageController.getReceivedMessages);

// @route   GET api/messages/sent
// @desc    Get sent messages
// @access  Private
router.get('/sent', auth, messageController.getSentMessages);

// @route   GET api/messages/:id
// @desc    Get message by ID
// @access  Private
router.get('/:id', auth, messageController.getMessageById);

// @route   PUT api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, messageController.markAsRead);

// @route   DELETE api/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/:id', auth, messageController.deleteMessage);

// @route   GET api/messages/unread-count
// @desc    Get unread messages count
// @access  Private
router.get('/unread-count', auth, messageController.getUnreadCount);
// Get unread messages count
router.get('/unread/count', auth, messageController.getUnreadCount);

module.exports = router;
