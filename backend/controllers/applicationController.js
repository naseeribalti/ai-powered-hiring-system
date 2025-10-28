const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { jobId } = req.params;
    const candidateId = req.user.id;

    // Check if job exists and is active
    const job = await Job.findById(jobId)
      .populate('company')
      .populate('recruiter');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active' || job.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Job is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: candidateId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Get candidate information
    const candidate = await User.findById(candidateId);

    // Create application
    const applicationData = {
      job: jobId,
      candidate: candidateId,
      recruiter: job.recruiter._id,
      company: job.company._id,
      coverLetter: req.body.coverLetter,
      portfolio: req.body.portfolio,
      customQuestions: req.body.customQuestions || [],
      candidateSnapshot: {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone,
        location: candidate.location,
        skills: candidate.skills,
        experience: candidate.experience,
        education: candidate.education
      },
      jobSnapshot: {
        title: job.title,
        company: job.company.name,
        location: job.locationString,
        salary: job.salary,
        jobType: job.jobType,
        workMode: job.workMode
      },
      timeline: [{
        status: 'applied',
        timestamp: new Date(),
        note: 'Application submitted'
      }]
    };

    const application = new Application(applicationData);
    await application.save();

    // Increment job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { 'analytics.applications': 1 } });

    // Populate application data
    await application.populate([
      { path: 'job', select: 'title company location salary jobType workMode' },
      { path: 'candidate', select: 'firstName lastName email skills experience' },
      { path: 'recruiter', select: 'firstName lastName email' },
      { path: 'company', select: 'name logo industry' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// Get applications by candidate
exports.getCandidateApplications = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const filters = { candidate: candidateId };
    if (status) {
      filters.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filters)
      .populate('job', 'title company location salary jobType workMode postedAt')
      .populate('recruiter', 'firstName lastName email')
      .populate('company', 'name logo industry')
      .sort({ createdAt: -1 })
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
    console.error('Get candidate applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(id)
      .populate('job', 'title company location salary jobType workMode description requirements')
      .populate('candidate', 'firstName lastName email phone skills experience location')
      .populate('recruiter', 'firstName lastName email phone')
      .populate('company', 'name logo industry website description');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user has access to this application
    const isCandidate = application.candidate._id.toString() === userId;
    const isRecruiter = application.recruiter._id.toString() === userId;

    if (!isCandidate && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
};

// Update application status (recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status
    application.status = status;
    
    // Add note if provided
    if (note) {
      application.recruiterNotes.push({
        note,
        addedBy: req.user.id,
        addedAt: new Date()
      });
    }

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// Add recruiter note
exports.addRecruiterNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, isPrivate = false } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this application'
      });
    }

    application.recruiterNotes.push({
      note,
      addedBy: req.user.id,
      isPrivate,
      addedAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Add recruiter note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

// Schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interviewData = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule interview for this application'
      });
    }

    // Add interview
    application.interviews.push({
      ...interviewData,
      interviewer: req.user.id,
      status: 'scheduled'
    });

    // Update application status
    application.status = 'interview_scheduled';

    await application.save();

    res.json({
      success: true,
      message: 'Interview scheduled successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message
    });
  }
};

// Update interview feedback
exports.updateInterviewFeedback = async (req, res) => {
  try {
    const { id, interviewId } = req.params;
    const feedbackData = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update interview feedback'
      });
    }

    // Find and update interview
    const interview = application.interviews.id(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    interview.feedback = feedbackData;
    interview.status = 'completed';

    await application.save();

    res.json({
      success: true,
      message: 'Interview feedback updated successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Update interview feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update interview feedback',
      error: error.message
    });
  }
};

// Make job offer
exports.makeJobOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offerData = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make offer for this application'
      });
    }

    // Create offer
    application.offer = {
      ...offerData,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    // Update application status
    application.status = 'offer_made';

    await application.save();

    res.json({
      success: true,
      message: 'Job offer made successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Make job offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to make job offer',
      error: error.message
    });
  }
};

// Respond to job offer (candidate only)
exports.respondToOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body; // 'accepted' or 'declined'

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the candidate
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this offer'
      });
    }

    // Check if offer exists and is still valid
    if (!application.offer || application.offer.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'No pending offer found'
      });
    }

    if (application.offer.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Offer has expired'
      });
    }

    // Update offer status
    application.offer.status = response;
    application.status = response === 'accepted' ? 'offer_accepted' : 'offer_declined';

    await application.save();

    res.json({
      success: true,
      message: `Offer ${response} successfully`,
      data: { application }
    });
  } catch (error) {
    console.error('Respond to offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to offer',
      error: error.message
    });
  }
};

// Withdraw application (candidate only)
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the candidate
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    const withdrawableStatuses = ['applied', 'under_review', 'shortlisted'];
    if (!withdrawableStatuses.includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Application cannot be withdrawn at this stage'
      });
    }

    // Update status
    application.status = 'withdrawn';

    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw application',
      error: error.message
    });
  }
};

// Get application statistics for recruiter
exports.getApplicationStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    const stats = await Application.aggregate([
      { $match: { recruiter: application.recruiter._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({ recruiter: recruiterId });
    const avgMatchScore = await Application.aggregate([
      { $match: { recruiter: application.recruiter._id } },
      { $group: { _id: null, avgScore: { $avg: '$aiMatch.overallScore' } } }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalApplications,
        averageMatchScore: avgMatchScore[0]?.avgScore || 0
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application statistics',
      error: error.message
    });
  }
};
