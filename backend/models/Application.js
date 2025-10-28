const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate is required']
  },
  
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recruiter is required']
  },
  
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  
  // Application Status
  status: {
    type: String,
    enum: [
      'applied',           // Initial application
      'under_review',      // Being reviewed by recruiter
      'shortlisted',       // Passed initial screening
      'interview_scheduled', // Interview scheduled
      'interviewed',       // Interview completed
      'offer_made',        // Job offer extended
      'offer_accepted',     // Offer accepted by candidate
      'offer_declined',    // Offer declined by candidate
      'rejected',          // Application rejected
      'withdrawn'          // Application withdrawn by candidate
    ],
    default: 'applied'
  },
  
  // Application Details
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  
  resume: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  portfolio: {
    url: String,
    description: String
  },
  
  // Additional Documents
  additionalDocuments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Application Questions/Answers
  customQuestions: [{
    question: String,
    answer: String,
    required: Boolean
  }],
  
  // Candidate Information (snapshot at time of application)
  candidateSnapshot: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    skills: [String],
    experience: String,
    education: String
  },
  
  // Job Information (snapshot at time of application)
  jobSnapshot: {
    title: String,
    company: String,
    location: String,
    salary: {
      min: Number,
      max: Number,
      currency: String,
      period: String
    },
    jobType: String,
    workMode: String
  },
  
  // AI Matching Score
  aiMatch: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    skillsMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    experienceMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    locationMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    salaryMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    lastCalculated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Recruiter Notes
  recruiterNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  
  // Interview Information
  interviews: [{
    scheduledAt: Date,
    duration: Number, // in minutes
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'panel']
    },
    location: String,
    meetingLink: String,
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      notes: String,
      strengths: [String],
      weaknesses: [String],
      recommendation: {
        type: String,
        enum: ['strong_hire', 'hire', 'no_hire', 'strong_no_hire']
      }
    }
  }],
  
  // Offer Information
  offer: {
    salary: {
      amount: Number,
      currency: String,
      period: String
    },
    startDate: Date,
    benefits: [String],
    notes: String,
    expiresAt: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending'
    }
  },
  
  // Timeline
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Flags
  isArchived: {
    type: Boolean,
    default: false
  },
  
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ candidate: 1, status: 1 });
applicationSchema.index({ recruiter: 1, status: 1 });
applicationSchema.index({ company: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ 'aiMatch.overallScore': -1 });
applicationSchema.index({ createdAt: -1 });

// Virtual fields
applicationSchema.virtual('isActive').get(function() {
  const activeStatuses = ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'offer_made'];
  return activeStatuses.includes(this.status);
});

applicationSchema.virtual('daysSinceApplied').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

applicationSchema.virtual('candidateName').get(function() {
  return `${this.candidateSnapshot.firstName} ${this.candidateSnapshot.lastName}`;
});

applicationSchema.virtual('jobTitle').get(function() {
  return this.jobSnapshot.title;
});

applicationSchema.virtual('companyName').get(function() {
  return this.jobSnapshot.company;
});

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  // Add to timeline when status changes
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status.replace('_', ' ')}`
    });
  }
  
  next();
});

// Instance methods
applicationSchema.methods.addNote = function(note, addedBy, isPrivate = false) {
  this.recruiterNotes.push({
    note,
    addedBy,
    isPrivate
  });
  return this.save();
};

applicationSchema.methods.scheduleInterview = function(interviewData) {
  this.interviews.push({
    ...interviewData,
    status: 'scheduled'
  });
  this.status = 'interview_scheduled';
  return this.save();
};

applicationSchema.methods.addMessage = function(sender, recipient, message) {
  this.messages.push({
    sender,
    recipient,
    message
  });
  return this.save();
};

applicationSchema.methods.updateAIMatch = function(scores) {
  this.aiMatch = {
    ...scores,
    lastCalculated: new Date()
  };
  return this.save();
};

// Static methods
applicationSchema.statics.findByCandidate = function(candidateId) {
  return this.find({ candidate: candidateId })
    .populate('job', 'title company location salary jobType workMode')
    .populate('recruiter', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

applicationSchema.statics.findByRecruiter = function(recruiterId) {
  return this.find({ recruiter: recruiterId })
    .populate('candidate', 'firstName lastName email skills experience')
    .populate('job', 'title company location salary jobType workMode')
    .sort({ createdAt: -1 });
};

applicationSchema.statics.findByJob = function(jobId) {
  return this.find({ job: jobId })
    .populate('candidate', 'firstName lastName email skills experience')
    .sort({ 'aiMatch.overallScore': -1, createdAt: -1 });
};

applicationSchema.statics.findByStatus = function(status) {
  return this.find({ status })
    .populate('candidate', 'firstName lastName email')
    .populate('job', 'title company location')
    .populate('recruiter', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

applicationSchema.statics.getApplicationStats = function(recruiterId) {
  return this.aggregate([
    { $match: { recruiter: mongoose.Types.ObjectId(recruiterId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Application', applicationSchema);
