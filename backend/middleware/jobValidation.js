const { body, param, query } = require('express-validator');

// Job creation validation
exports.validateJobCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 50 })
    .withMessage('Job description must be at least 50 characters'),
  
  body('company')
    .isMongoId()
    .withMessage('Valid company ID is required'),
  
  body('jobType')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  
  body('workMode')
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Invalid work mode'),
  
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('location.country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country name is too long'),
  
  body('salary.min')
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Minimum salary cannot be negative'),
  
  body('salary.max')
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Maximum salary cannot be negative'),
  
  body('salary.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency'),
  
  body('salary.period')
    .optional()
    .isIn(['hourly', 'monthly', 'yearly'])
    .withMessage('Invalid salary period'),
  
  body('requirements.experience.level')
    .isIn(['entry', 'mid', 'senior', 'executive'])
    .withMessage('Invalid experience level'),
  
  body('requirements.experience.min')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum experience must be a non-negative integer'),
  
  body('requirements.experience.max')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum experience must be a non-negative integer'),
  
  body('requirements.education')
    .optional()
    .isIn(['high-school', 'associate', 'bachelor', 'master', 'phd', 'none'])
    .withMessage('Invalid education level'),
  
  body('requirements.skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('requirements.skills.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill name is required'),
  
  body('requirements.skills.*.level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid skill level'),
  
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array'),
  
  body('benefits.*')
    .optional()
    .isIn([
      'health-insurance',
      'dental-insurance',
      'vision-insurance',
      'retirement-plan',
      'paid-time-off',
      'flexible-hours',
      'remote-work',
      'professional-development',
      'gym-membership',
      'stock-options',
      'bonus',
      'transportation',
      'meal-allowance',
      'childcare',
      'other'
    ])
    .withMessage('Invalid benefit type'),
  
  body('applicationProcess.deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline date'),
  
  body('applicationProcess.instructions')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Application instructions cannot exceed 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'paused', 'closed', 'filled'])
    .withMessage('Invalid job status'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'internal'])
    .withMessage('Invalid visibility setting')
];

// Job update validation
exports.validateJobUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job description cannot be empty')
    .isLength({ min: 50 })
    .withMessage('Job description must be at least 50 characters'),
  
  body('jobType')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  
  body('workMode')
    .optional()
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Invalid work mode'),
  
  body('salary.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Minimum salary cannot be negative'),
  
  body('salary.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .isFloat({ min: 0 })
    .withMessage('Maximum salary cannot be negative'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'paused', 'closed', 'filled'])
    .withMessage('Invalid job status')
];

// Job search validation
exports.validateJobSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query is too long'),
  
  query('location')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Location query is too long'),
  
  query('jobType')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  
  query('workMode')
    .optional()
    .isIn(['remote', 'onsite', 'hybrid'])
    .withMessage('Invalid work mode'),
  
  query('minSalary')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number'),
  
  query('maxSalary')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number'),
  
  query('experienceLevel')
    .optional()
    .isIn(['entry', 'mid', 'senior', 'executive'])
    .withMessage('Invalid experience level'),
  
  query('skills')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const skills = value.split(',');
        return skills.every(skill => skill.trim().length > 0);
      }
      return Array.isArray(value);
    })
    .withMessage('Invalid skills format'),
  
  query('sortBy')
    .optional()
    .isIn(['postedAt', 'salary.min', 'salary.max', 'title', 'company'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order')
];

// Job ID validation
exports.validateJobId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid job ID')
];

// Application validation
exports.validateApplication = [
  param('jobId')
    .isMongoId()
    .withMessage('Invalid job ID'),
  
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
  
  body('portfolio.url')
    .optional()
    .isURL()
    .withMessage('Portfolio URL must be valid'),
  
  body('portfolio.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Portfolio description cannot exceed 500 characters'),
  
  body('customQuestions')
    .optional()
    .isArray()
    .withMessage('Custom questions must be an array'),
  
  body('customQuestions.*.question')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Question cannot be empty'),
  
  body('customQuestions.*.answer')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Answer cannot be empty')
];

// Application status update validation
exports.validateApplicationStatusUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  
  body('status')
    .isIn([
      'applied',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'interviewed',
      'offer_made',
      'offer_accepted',
      'offer_declined',
      'rejected',
      'withdrawn'
    ])
    .withMessage('Invalid application status'),
  
  body('note')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Note cannot exceed 1000 characters')
];

// Interview scheduling validation
exports.validateInterviewScheduling = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  
  body('scheduledAt')
    .isISO8601()
    .withMessage('Invalid interview date'),
  
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  
  body('type')
    .isIn(['phone', 'video', 'in-person', 'technical', 'panel'])
    .withMessage('Invalid interview type'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location description is too long'),
  
  body('meetingLink')
    .optional()
    .isURL()
    .withMessage('Meeting link must be a valid URL')
];

// Interview feedback validation
exports.validateInterviewFeedback = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  
  param('interviewId')
    .isMongoId()
    .withMessage('Invalid interview ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('strengths')
    .optional()
    .isArray()
    .withMessage('Strengths must be an array'),
  
  body('weaknesses')
    .optional()
    .isArray()
    .withMessage('Weaknesses must be an array'),
  
  body('recommendation')
    .isIn(['strong_hire', 'hire', 'no_hire', 'strong_no_hire'])
    .withMessage('Invalid recommendation')
];

// Job offer validation
exports.validateJobOffer = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  
  body('salary.amount')
    .isNumeric()
    .withMessage('Salary amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Salary cannot be negative'),
  
  body('salary.currency')
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD'])
    .withMessage('Invalid currency'),
  
  body('salary.period')
    .isIn(['hourly', 'monthly', 'yearly'])
    .withMessage('Invalid salary period'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Invalid start date'),
  
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

// Offer response validation
exports.validateOfferResponse = [
  param('id')
    .isMongoId()
    .withMessage('Invalid application ID'),
  
  body('response')
    .isIn(['accepted', 'declined'])
    .withMessage('Response must be either accepted or declined')
];
