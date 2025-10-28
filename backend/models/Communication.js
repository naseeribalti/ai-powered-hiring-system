const mongoose = require('mongoose');

// Message Schema - for real-time messaging between users
const messageSchema = new mongoose.Schema({
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
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [5000, 'Message content cannot exceed 5000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'system', 'interview_invite', 'offer', 'rejection'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Conversation Schema - groups messages between users
const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  conversationType: {
    type: String,
    enum: ['direct', 'group', 'job_application', 'interview', 'team'],
    default: 'direct'
  },
  title: {
    type: String,
    maxlength: [200, 'Conversation title cannot exceed 200 characters']
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  settings: {
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    allowNotifications: {
      type: Boolean,
      default: true
    },
    muteUntil: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ conversationType: 1, lastMessageAt: -1 });
conversationSchema.index({ job: 1 });
conversationSchema.index({ application: 1 });
conversationSchema.index({ company: 1 });
conversationSchema.index({ isActive: 1, isArchived: 1 });

// Notification Schema - for system notifications and alerts
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'job_application', 'application_status', 'interview_scheduled', 'interview_reminder',
      'offer_made', 'offer_accepted', 'offer_declined', 'message_received',
      'job_match', 'recommendation', 'profile_view', 'skill_update',
      'company_update', 'system_announcement', 'deadline_reminder',
      'application_deadline', 'job_expired', 'new_job_posted'
    ]
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Notification title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [1000, 'Notification message cannot exceed 1000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'reminder'],
    default: 'info'
  },
  actionUrl: String,
  actionText: String,
  entityType: {
    type: String,
    enum: ['job', 'application', 'user', 'company', 'message', 'interview', 'system']
  },
  entityId: mongoose.Schema.Types.ObjectId,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  scheduledFor: Date,
  sentAt: Date,
  deliveryMethod: {
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
    default: 'in_app'
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ sentAt: 1 });

// Email Template Schema - for professional email communication
const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true,
    maxlength: [200, 'Email subject cannot exceed 200 characters']
  },
  templateType: {
    type: String,
    required: true,
    enum: [
      'welcome', 'job_application_received', 'application_status_update',
      'interview_invitation', 'interview_reminder', 'offer_letter',
      'rejection_notice', 'job_match_notification', 'password_reset',
      'email_verification', 'profile_completion', 'skill_recommendation',
      'deadline_reminder', 'system_maintenance', 'newsletter'
    ]
  },
  htmlContent: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    required: true
  },
  variables: [{
    name: String,
    description: String,
    required: Boolean,
    defaultValue: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUsed: Date,
  usageCount: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
emailTemplateSchema.index({ templateType: 1, isActive: 1 });
emailTemplateSchema.index({ createdBy: 1 });
emailTemplateSchema.index({ name: 1 });

// Email Log Schema - for tracking sent emails
const emailLogSchema = new mongoose.Schema({
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailTemplate'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'],
    default: 'pending'
  },
  sentAt: Date,
  deliveredAt: Date,
  openedAt: Date,
  clickedAt: Date,
  bouncedAt: Date,
  errorMessage: String,
  trackingId: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
emailLogSchema.index({ recipient: 1, sentAt: -1 });
emailLogSchema.index({ template: 1, sentAt: -1 });
emailLogSchema.index({ status: 1, sentAt: -1 });
emailLogSchema.index({ trackingId: 1 });

// Interview Schedule Schema - for interview management
const interviewScheduleSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewType: {
    type: String,
    enum: ['phone', 'video', 'on_site', 'technical', 'panel', 'hr'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60 // minutes
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  location: {
    type: String,
    required: function() {
      return this.interviewType === 'on_site';
    }
  },
  meetingLink: {
    type: String,
    required: function() {
      return this.interviewType === 'video';
    }
  },
  phoneNumber: {
    type: String,
    required: function() {
      return this.interviewType === 'phone';
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  notes: String,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    strengths: [String],
    weaknesses: [String],
    recommendation: {
      type: String,
      enum: ['strong_hire', 'hire', 'no_hire', 'strong_no_hire']
    },
    submittedAt: Date,
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'in_app']
    },
    scheduledFor: Date,
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  }],
  rescheduleHistory: [{
    originalDate: Date,
    newDate: Date,
    reason: String,
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: Date
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
interviewScheduleSchema.index({ application: 1 });
interviewScheduleSchema.index({ candidate: 1, scheduledDate: -1 });
interviewScheduleSchema.index({ interviewer: 1, scheduledDate: -1 });
interviewScheduleSchema.index({ scheduledDate: 1 });
interviewScheduleSchema.index({ status: 1 });

// Team Collaboration Schema - for team-based recruitment
const teamCollaborationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['recruiter', 'hiring_manager', 'interviewer', 'observer'],
      default: 'recruiter'
    },
    permissions: [{
      type: String,
      enum: ['view', 'comment', 'rate', 'decide', 'manage']
    }],
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Collaboration title cannot exceed 200 characters']
  },
  description: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    tags: [String]
  }],
  ratings: [{
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comments: String,
    criteria: [{
      name: String,
      score: Number,
      maxScore: Number
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  decisions: [{
    decision: {
      type: String,
      enum: ['proceed', 'reject', 'hold', 'more_interviews'],
      required: true
    },
    reason: String,
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    madeAt: {
      type: Date,
      default: Date.now
    },
    confidence: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
teamCollaborationSchema.index({ company: 1, status: 1 });
teamCollaborationSchema.index({ job: 1 });
teamCollaborationSchema.index({ application: 1 });
teamCollaborationSchema.index({ 'participants.user': 1 });

// Export all models
module.exports = {
  Message: mongoose.model('Message', messageSchema),
  Conversation: mongoose.model('Conversation', conversationSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  EmailTemplate: mongoose.model('EmailTemplate', emailTemplateSchema),
  EmailLog: mongoose.model('EmailLog', emailLogSchema),
  InterviewSchedule: mongoose.model('InterviewSchedule', interviewScheduleSchema),
  TeamCollaboration: mongoose.model('TeamCollaboration', teamCollaborationSchema)
};
