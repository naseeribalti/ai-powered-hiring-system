const { body, param, query } = require('express-validator');

// Company creation validation
exports.validateCompanyCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Company description is required')
    .isLength({ min: 50 })
    .withMessage('Company description must be at least 50 characters')
    .isLength({ max: 2000 })
    .withMessage('Company description cannot exceed 2000 characters'),
  
  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Short description cannot exceed 200 characters'),
  
  body('website')
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('industry')
    .trim()
    .notEmpty()
    .withMessage('Industry is required'),
  
  body('size')
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Please select a valid company size'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address is too long'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name is too long'),
  
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State name is too long'),
  
  body('address.zipCode')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Zip code is too long'),
  
  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name is too long'),
  
  body('founded')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Founded year must be between 1800 and current year'),
  
  body('mission')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mission statement cannot exceed 500 characters'),
  
  body('values')
    .optional()
    .isArray()
    .withMessage('Values must be an array'),
  
  body('values.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Each value cannot exceed 100 characters'),
  
  body('culture')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Culture description cannot exceed 1000 characters'),
  
  body('contact.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('contact.phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number is too long'),
  
  body('socialMedia.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
  
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be valid'),
  
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook URL must be valid'),
  
  body('socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be valid'),
  
  body('socialMedia.youtube')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be valid'),
  
  body('socialMedia.github')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be valid')
];

// Company update validation
exports.validateCompanyUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID'),
  
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company description cannot be empty')
    .isLength({ min: 50 })
    .withMessage('Company description must be at least 50 characters')
    .isLength({ max: 2000 })
    .withMessage('Company description cannot exceed 2000 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('industry')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Industry cannot be empty'),
  
  body('size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Please select a valid company size'),
  
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  
  body('founded')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Founded year must be between 1800 and current year'),
  
  body('mission')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mission statement cannot exceed 500 characters'),
  
  body('culture')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Culture description cannot exceed 1000 characters')
];

// Company search validation
exports.validateCompanySearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query is too long'),
  
  query('industry')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Industry filter is too long'),
  
  query('size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Invalid company size'),
  
  query('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location filter is too long'),
  
  query('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified filter must be boolean'),
  
  query('sortBy')
    .optional()
    .isIn(['analytics.profileViews', 'averageRating', 'totalReviews', 'createdAt', 'name'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order')
];

// Company ID validation
exports.validateCompanyId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID')
];

// Add recruiter validation
exports.validateAddRecruiter = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID'),
  
  body('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('role')
    .optional()
    .isIn(['recruiter', 'senior_recruiter', 'hiring_manager', 'talent_acquisition'])
    .withMessage('Invalid recruiter role'),
  
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
  
  body('permissions.*')
    .optional()
    .isIn(['view_jobs', 'create_jobs', 'edit_jobs', 'delete_jobs', 'view_applications', 'manage_applications', 'view_analytics'])
    .withMessage('Invalid permission')
];

// Remove recruiter validation
exports.validateRemoveRecruiter = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID'),
  
  param('recruiterId')
    .isMongoId()
    .withMessage('Invalid recruiter ID')
];

// Add review validation
exports.validateAddReview = [
  param('id')
    .isMongoId()
    .withMessage('Invalid company ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ max: 100 })
    .withMessage('Review title cannot exceed 100 characters'),
  
  body('review')
    .trim()
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ min: 10 })
    .withMessage('Review must be at least 10 characters')
    .isLength({ max: 1000 })
    .withMessage('Review cannot exceed 1000 characters'),
  
  body('pros')
    .optional()
    .isArray()
    .withMessage('Pros must be an array'),
  
  body('pros.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each pro cannot exceed 200 characters'),
  
  body('cons')
    .optional()
    .isArray()
    .withMessage('Cons must be an array'),
  
  body('cons.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each con cannot exceed 200 characters'),
  
  body('workLifeBalance')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Work-life balance rating must be between 1 and 5'),
  
  body('compensation')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Compensation rating must be between 1 and 5'),
  
  body('careerGrowth')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Career growth rating must be between 1 and 5'),
  
  body('management')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Management rating must be between 1 and 5'),
  
  body('culture')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Culture rating must be between 1 and 5')
];

// Company search body validation
exports.validateCompanySearchBody = [
  body('query')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query is too long'),
  
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Industry filter is too long'),
  
  body('size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('Invalid company size'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location filter is too long'),
  
  body('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified filter must be boolean'),
  
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  body('sortBy')
    .optional()
    .isIn(['analytics.profileViews', 'averageRating', 'totalReviews', 'createdAt', 'name'])
    .withMessage('Invalid sort field'),
  
  body('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order')
];
