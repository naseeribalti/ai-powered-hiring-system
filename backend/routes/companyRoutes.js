const express = require('express');
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  addRecruiterToCompany,
  removeRecruiterFromCompany,
  addCompanyReview,
  getCompanyJobs,
  getCompanyStats,
  uploadCompanyLogo
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  validateCompanyCreation, 
  validateCompanyUpdate, 
  validateAddRecruiter, 
  validateCompanyReview 
} = require('../middleware/companyValidation');

const router = express.Router();

// Public routes
router.get('/', getCompanies);
router.get('/:idOrSlug', getCompany);
router.get('/:id/jobs', getCompanyJobs);

// Private routes (Recruiter/Admin)
router.post('/', protect, authorize(['recruiter', 'admin']), validateCompanyCreation, createCompany);
router.put('/:id', protect, authorize(['recruiter', 'admin']), validateCompanyUpdate, updateCompany);
router.delete('/:id', protect, authorize(['recruiter', 'admin']), deleteCompany);

// Company management routes
router.put('/:id/recruiters', protect, authorize(['recruiter', 'admin']), validateAddRecruiter, addRecruiterToCompany);
router.delete('/:id/recruiters/:userId', protect, authorize(['recruiter', 'admin']), removeRecruiterFromCompany);

// Company reviews
router.post('/:id/reviews', protect, validateCompanyReview, addCompanyReview);

// Company analytics and stats
router.get('/:id/stats', protect, authorize(['recruiter', 'admin']), getCompanyStats);

// File upload routes
router.post('/:id/logo', protect, authorize(['recruiter', 'admin']), uploadCompanyLogo);

module.exports = router;
