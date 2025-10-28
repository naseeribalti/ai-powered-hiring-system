const {
  Message,
  Conversation,
  Notification,
  EmailTemplate,
  EmailLog,
  InterviewSchedule,
  TeamCollaboration
} = require('../models/Communication');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// @desc    Send a message
// @route   POST /api/communication/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, messageType = 'text', attachments = [], replyTo } = req.body;

    // Validate input
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient ID and content are required' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, recipientId] },
      conversationType: 'direct'
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, recipientId],
        conversationType: 'direct',
        title: `${req.user.firstName} & ${recipient.firstName}`
      });
    }

    // Create message
    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      conversationId: conversation._id,
      content,
      messageType,
      attachments,
      replyTo
    });

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Create notification for recipient
    await Notification.create({
      user: recipientId,
      type: 'message_received',
      title: 'New Message',
      message: `You received a message from ${req.user.firstName} ${req.user.lastName}`,
      entityType: 'message',
      entityId: message._id,
      actionUrl: `/messages/${conversation._id}`,
      actionText: 'View Message'
    });

    // Populate sender and recipient details
    await message.populate('sender', 'firstName lastName email avatar');
    await message.populate('recipient', 'firstName lastName email avatar');

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversations for a user
// @route   GET /api/communication/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      participants: req.user.id,
      isActive: true,
      isArchived: false
    };

    if (type) {
      query.conversationType = type;
    }

    const conversations = await Conversation.find(query)
      .populate('participants', 'firstName lastName email avatar')
      .populate('lastMessage')
      .populate('job', 'title company')
      .populate('application', 'status')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get unread message counts
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          recipient: req.user.id,
          isRead: false
        });

        return {
          ...conversation.toObject(),
          unreadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: conversationsWithUnread,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Conversation.countDocuments(query)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/communication/conversations/:conversationId/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify user is participant in conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'firstName lastName email avatar')
      .populate('recipient', 'firstName lastName email avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark messages as read
    await Message.updateMany(
      { conversationId, recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Return in chronological order
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ conversationId })
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notifications for a user
// @route   GET /api/communication/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: req.user.id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('entityId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Notification.countDocuments({ user: req.user.id })
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/communication/notifications/:notificationId/read
// @access  Private
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/communication/notifications/read-all
// @access  Private
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Schedule an interview
// @route   POST /api/communication/interviews
// @access  Private (Recruiter, Admin)
exports.scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      interviewerId,
      interviewType,
      scheduledDate,
      duration = 60,
      timezone = 'UTC',
      location,
      meetingLink,
      phoneNumber,
      notes
    } = req.body;

    // Validate input
    if (!applicationId || !interviewerId || !interviewType || !scheduledDate) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Get application details
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify user is authorized to schedule interview
    if (application.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this application' });
    }

    // Create interview schedule
    const interview = await InterviewSchedule.create({
      application: applicationId,
      job: application.job._id,
      candidate: application.applicant._id,
      interviewer: interviewerId,
      interviewType,
      scheduledDate: new Date(scheduledDate),
      duration,
      timezone,
      location,
      meetingLink,
      phoneNumber,
      notes
    });

    // Update application status
    application.status = 'interviewing';
    await application.save();

    // Create notifications
    await Promise.all([
      // Notification for candidate
      Notification.create({
        user: application.applicant._id,
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: `You have an interview scheduled for ${application.job.title}`,
        entityType: 'interview',
        entityId: interview._id,
        actionUrl: `/interviews/${interview._id}`,
        actionText: 'View Interview Details'
      }),
      // Notification for interviewer
      Notification.create({
        user: interviewerId,
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: `You have an interview scheduled with ${application.applicant.firstName} ${application.applicant.lastName}`,
        entityType: 'interview',
        entityId: interview._id,
        actionUrl: `/interviews/${interview._id}`,
        actionText: 'View Interview Details'
      })
    ]);

    // Schedule reminders
    await scheduleInterviewReminders(interview);

    // Populate interview details
    await interview.populate([
      { path: 'candidate', select: 'firstName lastName email phone' },
      { path: 'interviewer', select: 'firstName lastName email' },
      { path: 'job', select: 'title company' },
      { path: 'application', select: 'status' }
    ]);

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interviews for a user
// @route   GET /api/communication/interviews
// @access  Private
exports.getInterviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, upcoming = false } = req.query;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    if (req.user.role === 'job_seeker') {
      query.candidate = req.user.id;
    } else if (req.user.role === 'recruiter') {
      query.interviewer = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin can see all interviews
    }

    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
    }

    const interviews = await InterviewSchedule.find(query)
      .populate('candidate', 'firstName lastName email phone')
      .populate('interviewer', 'firstName lastName email')
      .populate('job', 'title company')
      .populate('application', 'status')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await InterviewSchedule.countDocuments(query)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview status
// @route   PUT /api/communication/interviews/:interviewId/status
// @access  Private
exports.updateInterviewStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const interview = await InterviewSchedule.findById(req.params.interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Verify authorization
    const isAuthorized = 
      interview.interviewer.toString() === req.user.id ||
      interview.candidate.toString() === req.user.id ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to update this interview' });
    }

    interview.status = status;
    if (notes) {
      interview.notes = notes;
    }

    await interview.save();

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit interview feedback
// @route   POST /api/communication/interviews/:interviewId/feedback
// @access  Private (Interviewer, Admin)
exports.submitInterviewFeedback = async (req, res, next) => {
  try {
    const {
      rating,
      comments,
      strengths,
      weaknesses,
      recommendation
    } = req.body;

    const interview = await InterviewSchedule.findById(req.params.interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Verify authorization (only interviewer or admin can submit feedback)
    if (interview.interviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to submit feedback for this interview' });
    }

    interview.feedback = {
      rating,
      comments,
      strengths,
      weaknesses,
      recommendation,
      submittedAt: new Date(),
      submittedBy: req.user.id
    };

    await interview.save();

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send email using template
// @route   POST /api/communication/emails/send
// @access  Private
exports.sendEmail = async (req, res, next) => {
  try {
    const { templateId, recipientId, variables = {} } = req.body;

    // Get template
    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Email template not found' });
    }

    // Get recipient
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Replace variables in template
    let subject = template.subject;
    let htmlContent = template.htmlContent;
    let textContent = template.textContent;

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, variables[key]);
      htmlContent = htmlContent.replace(regex, variables[key]);
      textContent = textContent.replace(regex, variables[key]);
    });

    // Create email log
    const emailLog = await EmailLog.create({
      template: templateId,
      recipient: recipientId,
      recipientEmail: recipient.email,
      subject,
      content: htmlContent,
      status: 'pending'
    });

    // Send email (implement actual email sending logic)
    try {
      await sendEmailToRecipient(recipient.email, subject, htmlContent, textContent);
      
      emailLog.status = 'sent';
      emailLog.sentAt = new Date();
      await emailLog.save();

      // Update template usage count
      template.lastUsed = new Date();
      template.usageCount += 1;
      await template.save();

      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        data: emailLog
      });
    } catch (emailError) {
      emailLog.status = 'failed';
      emailLog.errorMessage = emailError.message;
      await emailLog.save();

      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailError.message
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get email templates
// @route   GET /api/communication/emails/templates
// @access  Private
exports.getEmailTemplates = async (req, res, next) => {
  try {
    const { templateType, isActive = true } = req.query;

    const query = {};
    if (templateType) query.templateType = templateType;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const templates = await EmailTemplate.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team collaboration
// @route   POST /api/communication/team-collaboration
// @access  Private (Recruiter, Admin)
exports.createTeamCollaboration = async (req, res, next) => {
  try {
    const {
      companyId,
      jobId,
      applicationId,
      title,
      description,
      participants
    } = req.body;

    // Verify user has access to company
    if (req.user.role !== 'admin') {
      const company = await Company.findById(companyId);
      if (!company || company.admin.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to create collaboration for this company' });
      }
    }

    const collaboration = await TeamCollaboration.create({
      company: companyId,
      job: jobId,
      application: applicationId,
      title,
      description,
      participants: participants.map(p => ({
        user: p.userId,
        role: p.role || 'recruiter',
        permissions: p.permissions || ['view', 'comment']
      }))
    });

    // Create notifications for participants
    await Promise.all(
      participants.map(participant =>
        Notification.create({
          user: participant.userId,
          type: 'system_announcement',
          title: 'Added to Team Collaboration',
          message: `You've been added to "${title}" collaboration`,
          entityType: 'system',
          entityId: collaboration._id,
          actionUrl: `/collaboration/${collaboration._id}`,
          actionText: 'View Collaboration'
        })
      )
    );

    res.status(201).json({
      success: true,
      data: collaboration
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions

async function scheduleInterviewReminders(interview) {
  const reminders = [
    { type: 'email', hours: 24 }, // 24 hours before
    { type: 'email', hours: 2 },  // 2 hours before
    { type: 'in_app', hours: 1 }  // 1 hour before
  ];

  for (const reminder of reminders) {
    const scheduledFor = new Date(interview.scheduledDate);
    scheduledFor.setHours(scheduledFor.getHours() - reminder.hours);

    if (scheduledFor > new Date()) {
      interview.reminders.push({
        type: reminder.type,
        scheduledFor
      });
    }
  }

  await interview.save();
}

async function sendEmailToRecipient(email, subject, htmlContent, textContent) {
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject,
    text: textContent,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}
