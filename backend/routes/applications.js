const express = require('express');
const {
  applyToJob,
  getApplicationsForJob,
  getApplicationsForUser,
  getApplication,
  updateApplicationStatus,
  addInterviewSchedule,
  addFeedback,
  deleteApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Application management routes
router.post('/:jobId', authorize(['job_seeker']), applyToJob);
router.get('/job/:jobId', authorize(['recruiter', 'admin']), getApplicationsForJob);
router.get('/user/:userId', authorize(['job_seeker', 'admin']), getApplicationsForUser);
router.get('/:id', getApplication);
router.put('/:id/status', authorize(['recruiter', 'admin']), updateApplicationStatus);
router.put('/:id/interview', authorize(['recruiter', 'admin']), addInterviewSchedule);
router.put('/:id/feedback', authorize(['recruiter', 'admin']), addFeedback);
router.delete('/:id', deleteApplication);

module.exports = router;