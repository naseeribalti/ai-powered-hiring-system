const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Job description must be at least 50 characters']
  },
  
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required']
  },
  
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recruiter is required']
  },
  
  // Job Details
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: [true, 'Job type is required']
  },
  
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: [true, 'Work mode is required']
  },
  
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'United States'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Salary Information
  salary: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },
  
  // Requirements
  requirements: {
    experience: {
      min: {
        type: Number,
        default: 0,
        min: [0, 'Experience cannot be negative']
      },
      max: {
        type: Number,
        min: [0, 'Experience cannot be negative']
      },
      level: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive'],
        required: [true, 'Experience level is required']
      }
    },
    
    education: {
      type: String,
      enum: ['high-school', 'associate', 'bachelor', 'master', 'phd', 'none'],
      default: 'none'
    },
    
    skills: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
      },
      required: {
        type: Boolean,
        default: true
      }
    }],
    
    certifications: [{
      name: String,
      required: Boolean,
      default: false
    }]
  },
  
  // Benefits and Perks
  benefits: [{
    type: String,
    enum: [
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
    ]
  }],
  
  customBenefits: [{
    name: String,
    description: String
  }],
  
  // Application Process
  applicationProcess: {
    deadline: Date,
    applicationUrl: String,
    instructions: String,
    requiredDocuments: [{
      type: String,
      enum: ['resume', 'cover-letter', 'portfolio', 'references', 'certificates', 'other']
    }],
    customDocuments: [String]
  },
  
  // Job Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'draft'
  },
  
  visibility: {
    type: String,
    enum: ['public', 'private', 'internal'],
    default: 'public'
  },
  
  // Analytics and Metrics
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  
  // SEO and Search
  keywords: [String],
  tags: [String],
  
  // AI Matching
  aiProfile: {
    skillsWeight: Number,
    experienceWeight: Number,
    locationWeight: Number,
    salaryWeight: Number,
    lastUpdated: Date
  },
  
  // Timestamps
  postedAt: {
    type: Date,
    default: Date.now
  },
  
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
jobSchema.index({ title: 'text', description: 'text', 'location.city': 'text' });
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ recruiter: 1, status: 1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
jobSchema.index({ 'requirements.experience.level': 1 });
jobSchema.index({ 'requirements.skills.name': 1 });
jobSchema.index({ jobType: 1, workMode: 1 });
jobSchema.index({ status: 1, visibility: 1 });
jobSchema.index({ postedAt: -1 });
jobSchema.index({ expiresAt: 1 });

// Virtual fields
jobSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

jobSchema.virtual('isActive').get(function() {
  return this.status === 'active' && !this.isExpired;
});

jobSchema.virtual('salaryRange').get(function() {
  const { min, max, currency, period } = this.salary;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const periodText = period === 'yearly' ? 'year' : period === 'monthly' ? 'month' : 'hour';
  return `${formatCurrency(min)} - ${formatCurrency(max)} per ${periodText}`;
});

jobSchema.virtual('locationString').get(function() {
  const { city, state, country } = this.location;
  return `${city}, ${state}, ${country}`;
});

jobSchema.virtual('experienceRange').get(function() {
  const { min, max } = this.requirements.experience;
  if (max) {
    return `${min} - ${max} years`;
  }
  return `${min}+ years`;
});

// Pre-save middleware
jobSchema.pre('save', function(next) {
  // Ensure max salary is greater than min salary
  if (this.salary.max < this.salary.min) {
    return next(new Error('Maximum salary must be greater than minimum salary'));
  }
  
  // Ensure max experience is greater than min experience
  if (this.requirements.experience.max && 
      this.requirements.experience.max < this.requirements.experience.min) {
    return next(new Error('Maximum experience must be greater than minimum experience'));
  }
  
  // Generate keywords from title and description
  if (this.isModified('title') || this.isModified('description')) {
    const text = `${this.title} ${this.description}`.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    this.keywords = [...new Set(words.filter(word => 
      word.length > 2 && !stopWords.includes(word)
    ))].slice(0, 20);
  }
  
  next();
});

// Instance methods
jobSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

jobSchema.methods.incrementApplications = function() {
  this.analytics.applications += 1;
  return this.save();
};

jobSchema.methods.incrementSaves = function() {
  this.analytics.saves += 1;
  return this.save();
};

jobSchema.methods.incrementShares = function() {
  this.analytics.shares += 1;
  return this.save();
};

// Static methods
jobSchema.statics.findActiveJobs = function() {
  return this.find({ 
    status: 'active', 
    visibility: 'public',
    expiresAt: { $gt: new Date() }
  });
};

jobSchema.statics.searchJobs = function(query, filters = {}) {
  const searchQuery = {
    status: 'active',
    visibility: 'public',
    expiresAt: { $gt: new Date() },
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery);
};

jobSchema.statics.findByLocation = function(city, state, radius = 50) {
  return this.find({
    status: 'active',
    visibility: 'public',
    expiresAt: { $gt: new Date() },
    $or: [
      { 'location.city': new RegExp(city, 'i') },
      { 'location.state': new RegExp(state, 'i') },
      { workMode: 'remote' }
    ]
  });
};

jobSchema.statics.findBySalaryRange = function(minSalary, maxSalary) {
  return this.find({
    status: 'active',
    visibility: 'public',
    expiresAt: { $gt: new Date() },
    $or: [
      { 'salary.min': { $lte: maxSalary } },
      { 'salary.max': { $gte: minSalary } }
    ]
  });
};

jobSchema.statics.findBySkills = function(skills) {
  return this.find({
    status: 'active',
    visibility: 'public',
    expiresAt: { $gt: new Date() },
    'requirements.skills.name': { $in: skills }
  });
};

module.exports = mongoose.model('Job', jobSchema);
