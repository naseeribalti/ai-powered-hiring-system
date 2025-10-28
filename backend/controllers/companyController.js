const Company = require('../models/Company');
const User = require('../models/User');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// Get all companies with filtering and pagination
exports.getAllCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      industry,
      size,
      location,
      verified,
      sortBy = 'analytics.profileViews',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {
      'settings.allowPublicViewing': true
    };

    // Text search
    if (search) {
      filters.$text = { $search: search };
    }

    // Industry filter
    if (industry) {
      filters.industry = new RegExp(industry, 'i');
    }

    // Size filter
    if (size) {
      filters.size = size;
    }

    // Location filter
    if (location) {
      const locationRegex = new RegExp(location, 'i');
      filters.$or = [
        { 'address.city': locationRegex },
        { 'address.state': locationRegex },
        { location: locationRegex }
      ];
    }

    // Verification filter
    if (verified !== undefined) {
      filters.verified = verified === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const companies = await Company.find(filters)
      .populate('admin', 'firstName lastName email')
      .populate('recruiters.user', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalCompanies = await Company.countDocuments(filters);

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCompanies / parseInt(limit)),
          totalCompanies,
          hasNext: skip + companies.length < totalCompanies,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
};

// Get company by ID or slug
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by slug first, then by ID
    let company = await Company.findOne({ slug: id })
      .populate('admin', 'firstName lastName email phone')
      .populate('recruiters.user', 'firstName lastName email role')
      .populate('reviews.user', 'firstName lastName')
      .lean();

    if (!company) {
      company = await Company.findById(id)
        .populate('admin', 'firstName lastName email phone')
        .populate('recruiters.user', 'firstName lastName email role')
        .populate('reviews.user', 'firstName lastName')
        .lean();
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if company allows public viewing
    if (!company.settings.allowPublicViewing) {
      return res.status(403).json({
        success: false,
        message: 'Company profile is private'
      });
    }

    // Increment view count
    await Company.findByIdAndUpdate(company._id, { 
      $inc: { 'analytics.profileViews': 1 },
      $set: { 'analytics.lastActiveDate': new Date() }
    });

    // Get company's active jobs
    const activeJobs = await Job.find({
      company: company._id,
      status: 'active',
      visibility: 'public',
      expiresAt: { $gt: new Date() }
    })
    .select('title location salary jobType workMode postedAt')
    .sort({ postedAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: { 
        company: {
          ...company,
          activeJobs
        }
      }
    });
  } catch (error) {
    console.error('Get company by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company',
      error: error.message
    });
  }
};

// Create new company
exports.createCompany = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const companyData = {
      ...req.body,
      admin: req.user.id
    };

    const company = new Company(companyData);
    await company.save();

    // Add the admin as a recruiter with full permissions
    await company.addRecruiter(req.user.id, 'hiring_manager', [
      'view_jobs', 'create_jobs', 'edit_jobs', 'delete_jobs', 
      'view_applications', 'manage_applications', 'view_analytics'
    ]);

    // Populate the created company
    await company.populate([
      { path: 'admin', select: 'firstName lastName email' },
      { path: 'recruiters.user', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create company',
      error: error.message
    });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user is the admin or has permission to edit
    const isAdmin = company.admin.toString() === req.user.id;
    const isRecruiter = company.recruiters.some(r => 
      r.user.toString() === req.user.id && 
      r.permissions.includes('edit_jobs')
    );

    if (!isAdmin && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    // Update company
    Object.assign(company, req.body);
    await company.save();

    // Populate the updated company
    await company.populate([
      { path: 'admin', select: 'firstName lastName email' },
      { path: 'recruiters.user', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company',
      error: error.message
    });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user is the admin
    if (company.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this company'
      });
    }

    // Check if company has active jobs
    const activeJobsCount = await Job.countDocuments({
      company: id,
      status: 'active'
    });

    if (activeJobsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete company with active job postings'
      });
    }

    await Company.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message
    });
  }
};

// Get companies by user (admin or recruiter)
exports.getUserCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const companies = await Company.find({
      $or: [
        { admin: userId },
        { 'recruiters.user': userId }
      ]
    })
    .populate('admin', 'firstName lastName email')
    .populate('recruiters.user', 'firstName lastName email')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { companies }
    });
  } catch (error) {
    console.error('Get user companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user companies',
      error: error.message
    });
  }
};

// Add recruiter to company
exports.addRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, permissions } = req.body;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user is the admin
    if (company.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add recruiters to this company'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await company.addRecruiter(userId, role, permissions);

    res.json({
      success: true,
      message: 'Recruiter added successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Add recruiter error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add recruiter',
      error: error.message
    });
  }
};

// Remove recruiter from company
exports.removeRecruiter = async (req, res) => {
  try {
    const { id, recruiterId } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user is the admin
    if (company.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove recruiters from this company'
      });
    }

    await company.removeRecruiter(recruiterId);

    res.json({
      success: true,
      message: 'Recruiter removed successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Remove recruiter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove recruiter',
      error: error.message
    });
  }
};

// Add company review
exports.addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewData = {
      ...req.body,
      user: req.user.id
    };

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    await company.addReview(reviewData);

    res.json({
      success: true,
      message: 'Review added successfully',
      data: { company }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add review',
      error: error.message
    });
  }
};

// Get company statistics
exports.getCompanyStats = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if user has access to stats
    const isAdmin = company.admin.toString() === req.user.id;
    const isRecruiter = company.recruiters.some(r => 
      r.user.toString() === req.user.id && 
      r.permissions.includes('view_analytics')
    );

    if (!isAdmin && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view company statistics'
      });
    }

    // Get job statistics
    const jobStats = await Job.aggregate([
      { $match: { company: company._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ company: company._id });
    const activeJobs = await Job.countDocuments({ 
      company: company._id, 
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    res.json({
      success: true,
      data: {
        companyAnalytics: company.analytics,
        jobStats,
        totalJobs,
        activeJobs,
        totalReviews: company.totalReviews,
        averageRating: company.averageRating
      }
    });
  } catch (error) {
    console.error('Get company stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company statistics',
      error: error.message
    });
  }
};

// Search companies
exports.searchCompanies = async (req, res) => {
  try {
    const {
      query,
      industry,
      size,
      location,
      verified,
      page = 1,
      limit = 12,
      sortBy = 'analytics.profileViews',
      sortOrder = 'desc'
    } = req.body;

    // Build search query
    const searchQuery = {
      'settings.allowPublicViewing': true
    };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Additional filters
    if (industry) searchQuery.industry = new RegExp(industry, 'i');
    if (size) searchQuery.size = size;
    if (verified !== undefined) searchQuery.verified = verified;

    // Location search
    if (location) {
      const locationRegex = new RegExp(location, 'i');
      searchQuery.$or = [
        { 'address.city': locationRegex },
        { 'address.state': locationRegex },
        { location: locationRegex }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const companies = await Company.find(searchQuery)
      .populate('admin', 'firstName lastName email')
      .populate('recruiters.user', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalCompanies = await Company.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCompanies / parseInt(limit)),
          totalCompanies
        }
      }
    });
  } catch (error) {
    console.error('Search companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search companies',
      error: error.message
    });
  }
};

// Get top rated companies
exports.getTopRatedCompanies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const companies = await Company.findTopRated(parseInt(limit));

    res.json({
      success: true,
      data: { companies }
    });
  } catch (error) {
    console.error('Get top rated companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated companies',
      error: error.message
    });
  }
};

// Get trending companies
exports.getTrendingCompanies = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const companies = await Company.findTrending(parseInt(limit));

    res.json({
      success: true,
      data: { companies }
    });
  } catch (error) {
    console.error('Get trending companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending companies',
      error: error.message
    });
  }
};
