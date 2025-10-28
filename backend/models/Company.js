const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Company description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
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
    type: String,
    default: ''
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
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
    country: String
  },
  founded: {
    type: Number,
    min: [1800, 'Founded year seems invalid'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  verified: {
    type: Boolean,
    default: false
  },
  contact: {
    email: String,
    phone: String
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for search functionality
companySchema.index({ name: 'text', description: 'text', industry: 'text' });
companySchema.index({ industry: 1 });
companySchema.index({ size: 1 });
companySchema.index({ location: 1 });

// Virtual for job count (will be populated when we create Job model)
companySchema.virtual('jobCount', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company',
  count: true
});

// Ensure virtual fields are serialized
companySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Company', companySchema);
