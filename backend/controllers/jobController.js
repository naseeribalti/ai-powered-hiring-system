const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// Get all jobs with filtering and pagination
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      workMode,
      minSalary,
      maxSalary,
      experienceLevel,
      skills,
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {
      status: 'active',
      visibility: 'public',
      expiresAt: { $gt: new Date() }
    };

    // Text search
    if (search) {
      filters.$text = { $search: search };
    }

    // Location filter
    if (location) {
      const locationRegex = new RegExp(location, 'i');
      filters.$or = [
        { 'location.city': locationRegex },
        { 'location.state': locationRegex },
        { workMode: 'remote' }
      ];
    }

    // Job type filter
    if (jobType) {
      filters.jobType = jobType;
    }

    // Work mode filter
    if (workMode) {
      filters.workMode = workMode;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filters.$or = filters.$or || [];
      if (minSalary && maxSalary) {
        filters.$or.push({
          $and: [
            { 'salary.min': { $lte: parseInt(maxSalary) } },
            { 'salary.max': { $gte: parseInt(minSalary) } }
          ]
        });
      } else if (minSalary) {
        filters.$or.push({ 'salary.max': { $gte: parseInt(minSalary) } });
      } else if (maxSalary) {
        filters.$or.push({ 'salary.min': { $lte: parseInt(maxSalary) } });
      }
    }

    // Experience level filter
    if (experienceLevel) {
      filters['requirements.experience.level'] = experienceLevel;
    }

    // Skills filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      filters['requirements.skills.name'] = { $in: skillsArray };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filters)
      .populate('company', 'name logo industry size')
      .populate('recruiter', 'firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filters);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs,
          hasNext: skip + jobs.length < totalJobs,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('company', 'name logo industry size website description')
      .populate('recruiter', 'firstName lastName email phone')
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is active and not expired
    if (job.status !== 'active' || job.expiresAt < new Date()) {
      return res.status(404).json({
        success: false,
        message: 'Job is no longer available'
      });
    }

    // Increment view count
    await Job.findByIdAndUpdate(id, { $inc: { 'analytics.views': 1 } });

    res.json({
      success: true,
      data: { job }
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// Create new job
exports.createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const jobData = {
      ...req.body,
      recruiter: req.user.id
    };

    const job = new Job(jobData);
    await job.save();

    // Populate the created job
    await job.populate([
      { path: 'company', select: 'name logo industry' },
      { path: 'recruiter', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// Update job
exports.updateJob = async (req, res) => {
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

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Update job
    Object.assign(job, req.body);
    await job.save();

    // Populate the updated job
    await job.populate([
      { path: 'company', select: 'name logo industry' },
      { path: 'recruiter', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Soft delete by changing status to 'closed'
    job.status = 'closed';
    await job.save();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// Get jobs by recruiter
exports.getJobsByRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const filters = { recruiter: recruiterId };
    if (status) {
      filters.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(filters)
      .populate('company', 'name logo industry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments(filters);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs
        }
      }
    });
  } catch (error) {
    console.error('Get jobs by recruiter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recruiter jobs',
      error: error.message
    });
  }
};

// Get job applications
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10, sortBy = 'aiMatch.overallScore', sortOrder = 'desc' } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    const filters = { job: jobId };
    if (status) {
      filters.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filters)
      .populate('candidate', 'firstName lastName email skills experience location')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalApplications = await Application.countDocuments(filters);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalApplications / parseInt(limit)),
          totalApplications
        }
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
      error: error.message
    });
  }
};

// Get job statistics
exports.getJobStats = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view stats for this job'
      });
    }

    const stats = await Application.aggregate([
      { $match: { job: job._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({ job: jobId });
    const avgMatchScore = await Application.aggregate([
      { $match: { job: job._id } },
      { $group: { _id: null, avgScore: { $avg: '$aiMatch.overallScore' } } }
    ]);

    res.json({
      success: true,
      data: {
        jobAnalytics: job.analytics,
        applicationStats: stats,
        totalApplications,
        averageMatchScore: avgMatchScore[0]?.avgScore || 0
      }
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: error.message
    });
  }
};

// Search jobs with advanced filters
exports.searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      jobType,
      workMode,
      minSalary,
      maxSalary,
      experienceLevel,
      skills,
      company,
      benefits,
      page = 1,
      limit = 10,
      sortBy = 'postedAt',
      sortOrder = 'desc'
    } = req.body;

    // Build search query
    const searchQuery = {
      status: 'active',
      visibility: 'public',
      expiresAt: { $gt: new Date() }
    };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Location search
    if (location) {
      const locationRegex = new RegExp(location, 'i');
      searchQuery.$or = [
        { 'location.city': locationRegex },
        { 'location.state': locationRegex },
        { workMode: 'remote' }
      ];
    }

    // Additional filters
    if (jobType) searchQuery.jobType = jobType;
    if (workMode) searchQuery.workMode = workMode;
    if (experienceLevel) searchQuery['requirements.experience.level'] = experienceLevel;
    if (company) searchQuery.company = company;
    if (benefits) searchQuery.benefits = { $in: benefits };

    // Salary range
    if (minSalary || maxSalary) {
      searchQuery.$or = searchQuery.$or || [];
      if (minSalary && maxSalary) {
        searchQuery.$or.push({
          $and: [
            { 'salary.min': { $lte: parseInt(maxSalary) } },
            { 'salary.max': { $gte: parseInt(minSalary) } }
          ]
        });
      } else if (minSalary) {
        searchQuery.$or.push({ 'salary.max': { $gte: parseInt(minSalary) } });
      } else if (maxSalary) {
        searchQuery.$or.push({ 'salary.min': { $lte: parseInt(maxSalary) } });
      }
    }

    // Skills filter
    if (skills && skills.length > 0) {
      searchQuery['requirements.skills.name'] = { $in: skills };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(searchQuery)
      .populate('company', 'name logo industry size')
      .populate('recruiter', 'firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / parseInt(limit)),
          totalJobs
        }
      }
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search jobs',
      error: error.message
    });
  }
};
