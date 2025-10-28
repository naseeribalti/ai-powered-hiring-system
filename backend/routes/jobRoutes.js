const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');
const jobValidation = require('../middleware/jobValidation');

// Job Routes

// Get all jobs (public)
router.get('/',
  jobValidation.validateJobSearch,
  jobController.getAllJobs
);

// Search jobs (public)
router.post('/search',
  jobValidation.validateJobSearch,
  jobController.searchJobs
);

// Get job by ID (public)
router.get('/:id',
  jobValidation.validateJobId,
  jobController.getJobById
);

// Create job (recruiter only)
router.post('/',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateJobCreation,
  jobController.createJob
);

// Update job (recruiter only)
router.put('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateJobUpdate,
  jobController.updateJob
);

// Delete job (recruiter only)
router.delete('/:id',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateJobId,
  jobController.deleteJob
);

// Get jobs by recruiter
router.get('/recruiter/:recruiterId',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobController.getJobsByRecruiter
);

// Get job applications (recruiter only)
router.get('/:jobId/applications',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobController.getJobApplications
);

// Get job statistics (recruiter only)
router.get('/:jobId/stats',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobController.getJobStats
);

// Application Routes

// Apply for job (job seeker only)
router.post('/:jobId/apply',
  authMiddleware.authenticate,
  authMiddleware.authorize(['job_seeker']),
  jobValidation.validateApplication,
  applicationController.applyForJob
);

// Get candidate applications (job seeker only)
router.get('/applications/candidate',
  authMiddleware.authenticate,
  authMiddleware.authorize(['job_seeker']),
  applicationController.getCandidateApplications
);

// Get application by ID
router.get('/applications/:id',
  authMiddleware.authenticate,
  applicationController.getApplicationById
);

// Update application status (recruiter only)
router.put('/applications/:id/status',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateApplicationStatusUpdate,
  applicationController.updateApplicationStatus
);

// Add recruiter note (recruiter only)
router.post('/applications/:id/notes',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  applicationController.addRecruiterNote
);

// Schedule interview (recruiter only)
router.post('/applications/:id/interviews',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateInterviewScheduling,
  applicationController.scheduleInterview
);

// Update interview feedback (recruiter only)
router.put('/applications/:id/interviews/:interviewId/feedback',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateInterviewFeedback,
  applicationController.updateInterviewFeedback
);

// Make job offer (recruiter only)
router.post('/applications/:id/offer',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  jobValidation.validateJobOffer,
  applicationController.makeJobOffer
);

// Respond to job offer (job seeker only)
router.put('/applications/:id/offer/respond',
  authMiddleware.authenticate,
  authMiddleware.authorize(['job_seeker']),
  jobValidation.validateOfferResponse,
  applicationController.respondToOffer
);

// Withdraw application (job seeker only)
router.put('/applications/:id/withdraw',
  authMiddleware.authenticate,
  authMiddleware.authorize(['job_seeker']),
  applicationController.withdrawApplication
);

// Get application statistics (recruiter only)
router.get('/applications/stats/recruiter',
  authMiddleware.authenticate,
  authMiddleware.authorize(['recruiter', 'admin']),
  applicationController.getApplicationStats
);

module.exports = router;
