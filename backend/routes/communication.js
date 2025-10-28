const express = require('express');
const {
  sendMessage,
  getConversations,
  getMessages,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  scheduleInterview,
  getInterviews,
  updateInterviewStatus,
  submitInterviewFeedback,
  sendEmail,
  getEmailTemplates,
  createTeamCollaboration
} = require('../controllers/communicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Messaging routes
router.post('/messages', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);

// Notification routes
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId/read', markNotificationAsRead);
router.put('/notifications/read-all', markAllNotificationsAsRead);

// Interview management routes
router.post('/interviews', authorize(['recruiter', 'admin']), scheduleInterview);
router.get('/interviews', getInterviews);
router.put('/interviews/:interviewId/status', updateInterviewStatus);
router.post('/interviews/:interviewId/feedback', authorize(['recruiter', 'admin']), submitInterviewFeedback);

// Email routes
router.post('/emails/send', sendEmail);
router.get('/emails/templates', getEmailTemplates);

// Team collaboration routes
router.post('/team-collaboration', authorize(['recruiter', 'admin']), createTeamCollaboration);

module.exports = router;
