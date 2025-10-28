const express = require('express');
const {
  trackEvent,
  getDashboardMetrics,
  getRecruitmentAnalytics,
  getCandidateAnalytics,
  getCompanyAnalytics,
  getMarketIntelligence,
  getAIPerformance,
  generateReport,
  getReportTemplates,
  createReportTemplate,
  getDashboardConfig,
  updateDashboardConfig
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Event tracking
router.post('/track', trackEvent);

// Dashboard and metrics
router.get('/dashboard', getDashboardMetrics);
router.get('/dashboard/config', getDashboardConfig);
router.put('/dashboard/config', updateDashboardConfig);

// Analytics endpoints
router.get('/recruitment', authorize(['recruiter', 'admin']), getRecruitmentAnalytics);
router.get('/candidates', authorize(['recruiter', 'admin']), getCandidateAnalytics);
router.get('/company/:companyId', authorize(['recruiter', 'admin']), getCompanyAnalytics);
router.get('/market-intelligence', authorize(['recruiter', 'admin']), getMarketIntelligence);
router.get('/ai-performance', authorize(['admin']), getAIPerformance);

// Reporting
router.get('/reports/templates', getReportTemplates);
router.post('/reports/templates', authorize(['recruiter', 'admin']), createReportTemplate);
router.post('/reports/generate', generateReport);

module.exports = router;
