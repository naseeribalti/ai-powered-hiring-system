const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  
  description: {
    type: String,
    required: [true, 'Company description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  website: {
    type: String,
    required: [true, 'Website is required'],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  
  logo: {
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  coverImage: {
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  
  subIndustry: {
    type: String,
    trim: true
  },
  
  size: {
    type: String,
    enum: {
      values: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      message: 'Please select a valid company size'
    },
    required: [true, 'Company size is required']
  },
  
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'United States'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  founded: {
    type: Number,
    min: [1800, 'Founded year seems invalid'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  
  // Company Culture & Values
  mission: {
    type: String,
    maxlength: [500, 'Mission statement cannot exceed 500 characters']
  },
  
  values: [{
    type: String,
    trim: true
  }],
  
  culture: {
    type: String,
    maxlength: [1000, 'Culture description cannot exceed 1000 characters']
  },
  
  // Company Benefits & Perks
  benefits: [{
    name: String,
    description: String,
    category: {
      type: String,
      enum: ['health', 'financial', 'work-life', 'professional', 'other']
    }
  }],
  
  // Company Stats & Metrics
  stats: {
    totalEmployees: Number,
    annualRevenue: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    growthRate: Number,
    employeeSatisfaction: Number,
    retentionRate: Number
  },
  
  // Company Recognition & Awards
  awards: [{
    name: String,
    year: Number,
    organization: String,
    description: String
  }],
  
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    expiryDate: Date
  }],
  
  // Social Media & Online Presence
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String,
    github: String
  },
  
  // Contact Information
  contact: {
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: String,
    fax: String
  },
  
  // Company Status & Verification
  verified: {
    type: Boolean,
    default: false
  },
  
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  
  verificationDocuments: [{
    type: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Company Settings
  settings: {
    allowPublicViewing: {
      type: Boolean,
      default: true
    },
    allowJobApplications: {
      type: Boolean,
      default: true
    },
    requireApplicationApproval: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  
  // Company Analytics
  analytics: {
    profileViews: {
      type: Number,
      default: 0
    },
    jobPostings: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    lastActiveDate: Date
  },
  
  // Company Team
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  recruiters: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['recruiter', 'senior_recruiter', 'hiring_manager', 'talent_acquisition'],
      default: 'recruiter'
    },
    permissions: [{
      type: String,
      enum: ['view_jobs', 'create_jobs', 'edit_jobs', 'delete_jobs', 'view_applications', 'manage_applications', 'view_analytics']
    }],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Company Reviews & Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    title: String,
    review: String,
    pros: [String],
    cons: [String],
    workLifeBalance: Number,
    compensation: Number,
    careerGrowth: Number,
    management: Number,
    culture: Number,
    isVerified: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
companySchema.index({ name: 'text', description: 'text', industry: 'text', shortDescription: 'text' });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });
companySchema.index({ location: 1 });
companySchema.index({ verified: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ 'address.city': 1, 'address.state': 1 });
companySchema.index({ averageRating: -1 });
companySchema.index({ 'analytics.profileViews': -1 });

// Virtual for job count
companySchema.virtual('jobCount', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company',
  count: true
});

// Virtual for active jobs count
companySchema.virtual('activeJobCount', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company',
  count: true,
  match: { status: 'active', expiresAt: { $gt: new Date() } }
});

// Virtual for company age
companySchema.virtual('age').get(function() {
  if (this.founded) {
    return new Date().getFullYear() - this.founded;
  }
  return null;
});

// Virtual for full address
companySchema.virtual('fullAddress').get(function() {
  const { street, city, state, zipCode, country } = this.address;
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.join(', ');
});

// Virtual for company size display
companySchema.virtual('sizeDisplay').get(function() {
  const sizeMap = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1000 employees',
    '1000+': '1000+ employees'
  };
  return sizeMap[this.size] || this.size;
});

// Pre-save middleware
companySchema.pre('save', function(next) {
  // Generate slug from name
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Update average rating when reviews change
  if (this.isModified('reviews')) {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
      this.totalReviews = this.reviews.length;
    } else {
      this.averageRating = 0;
      this.totalReviews = 0;
    }
  }
  
  next();
});

// Instance methods
companySchema.methods.incrementProfileViews = function() {
  this.analytics.profileViews += 1;
  this.analytics.lastActiveDate = new Date();
  return this.save();
};

companySchema.methods.addRecruiter = function(userId, role = 'recruiter', permissions = []) {
  const recruiter = {
    user: userId,
    role,
    permissions,
    addedAt: new Date()
  };
  
  // Check if recruiter already exists
  const existingRecruiter = this.recruiters.find(r => r.user.toString() === userId.toString());
  if (existingRecruiter) {
    return Promise.reject(new Error('User is already a recruiter for this company'));
  }
  
  this.recruiters.push(recruiter);
  return this.save();
};

companySchema.methods.removeRecruiter = function(userId) {
  this.recruiters = this.recruiters.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

companySchema.methods.addReview = function(reviewData) {
  // Check if user has already reviewed this company
  const existingReview = this.reviews.find(r => r.user.toString() === reviewData.user.toString());
  if (existingReview) {
    return Promise.reject(new Error('User has already reviewed this company'));
  }
  
  this.reviews.push({
    ...reviewData,
    createdAt: new Date()
  });
  
  return this.save();
};

companySchema.methods.updateAnalytics = function() {
  this.analytics.lastActiveDate = new Date();
  return this.save();
};

// Static methods
companySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug });
};

companySchema.statics.searchCompanies = function(query, filters = {}) {
  const searchQuery = {
    verified: true,
    'settings.allowPublicViewing': true,
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery);
};

companySchema.statics.findByIndustry = function(industry) {
  return this.find({ 
    industry: new RegExp(industry, 'i'),
    verified: true,
    'settings.allowPublicViewing': true
  });
};

companySchema.statics.findByLocation = function(city, state) {
  return this.find({
    $or: [
      { 'address.city': new RegExp(city, 'i') },
      { 'address.state': new RegExp(state, 'i') },
      { location: new RegExp(`${city}|${state}`, 'i') }
    ],
    verified: true,
    'settings.allowPublicViewing': true
  });
};

companySchema.statics.findTopRated = function(limit = 10) {
  return this.find({
    verified: true,
    'settings.allowPublicViewing': true,
    averageRating: { $gte: 4.0 },
    totalReviews: { $gte: 5 }
  })
  .sort({ averageRating: -1, totalReviews: -1 })
  .limit(limit);
};

companySchema.statics.findTrending = function(limit = 10) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.find({
    verified: true,
    'settings.allowPublicViewing': true,
    'analytics.lastActiveDate': { $gte: thirtyDaysAgo }
  })
  .sort({ 'analytics.profileViews': -1 })
  .limit(limit);
};

module.exports = mongoose.model('Company', companySchema);
