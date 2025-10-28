const mongoose = require('mongoose');

// Analytics Event Schema - tracks all user interactions and system events
const analyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'user_registration', 'user_login', 'user_logout',
      'job_view', 'job_apply', 'job_save', 'job_share',
      'profile_view', 'profile_update', 'resume_upload',
      'search_performed', 'filter_applied', 'recommendation_viewed',
      'application_submitted', 'application_reviewed', 'application_status_changed',
      'interview_scheduled', 'interview_completed', 'offer_made', 'offer_accepted',
      'company_profile_view', 'company_profile_update', 'job_posted', 'job_updated',
      'ai_match_generated', 'ai_recommendation_viewed', 'skill_gap_analyzed'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: ['job', 'user', 'company', 'application', 'ai_match', 'recommendation'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  pageUrl: String
}, {
  timestamps: true
});

// Indexes for efficient querying
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
analyticsEventSchema.index({ sessionId: 1, timestamp: -1 });
analyticsEventSchema.index({ timestamp: -1 });

// Analytics Metrics Schema - aggregated metrics for performance
const analyticsMetricsSchema = new mongoose.Schema({
  metricType: {
    type: String,
    required: true,
    enum: [
      'daily_active_users', 'monthly_active_users', 'total_users',
      'job_views', 'job_applications', 'job_postings', 'active_jobs',
      'application_rate', 'conversion_rate', 'time_to_hire',
      'ai_match_accuracy', 'recommendation_click_rate', 'search_success_rate',
      'company_profile_views', 'recruiter_activity', 'candidate_engagement',
      'skill_trends', 'salary_trends', 'location_trends', 'industry_trends'
    ]
  },
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  dimensions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
analyticsMetricsSchema.index({ metricType: 1, date: -1 });
analyticsMetricsSchema.index({ date: -1 });
analyticsMetricsSchema.index({ metricType: 1, 'dimensions.industry': 1, date: -1 });
analyticsMetricsSchema.index({ metricType: 1, 'dimensions.location': 1, date: -1 });

// User Analytics Schema - individual user analytics
const userAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalJobViews: {
    type: Number,
    default: 0
  },
  totalApplications: {
    type: Number,
    default: 0
  },
  totalSearches: {
    type: Number,
    default: 0
  },
  averageSessionDuration: {
    type: Number,
    default: 0
  },
  preferredJobTypes: [{
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'remote']
  }],
  preferredIndustries: [String],
  preferredLocations: [String],
  skillInterests: [String],
  engagementScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  aiMatchAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  behaviorPatterns: {
    peakActivityHours: [Number],
    preferredDays: [String],
    deviceTypes: [String],
    searchPatterns: [String]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ lastActiveDate: -1 });
userAnalyticsSchema.index({ engagementScore: -1 });
userAnalyticsSchema.index({ profileCompleteness: -1 });

// Job Analytics Schema - individual job analytics
const jobAnalyticsSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    unique: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  totalApplications: {
    type: Number,
    default: 0
  },
  totalSaves: {
    type: Number,
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  applicationRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageTimeToApply: {
    type: Number,
    default: 0
  },
  topSources: [{
    source: String,
    count: Number
  }],
  demographicBreakdown: {
    ageGroups: [{
      range: String,
      count: Number
    }],
    experienceLevels: [{
      level: String,
      count: Number
    }],
    locations: [{
      location: String,
      count: Number
    }]
  },
  skillMatchAnalysis: {
    topMatchedSkills: [{
      skill: String,
      matchCount: Number,
      averageScore: Number
    }],
    skillGaps: [{
      skill: String,
      gapCount: Number
    }]
  },
  aiRecommendationPerformance: {
    totalRecommendations: {
      type: Number,
      default: 0
    },
    clickedRecommendations: {
      type: Number,
      default: 0
    },
    appliedFromRecommendations: {
      type: Number,
      default: 0
    },
    clickThroughRate: {
      type: Number,
      default: 0
    },
    applicationRate: {
      type: Number,
      default: 0
    }
  },
  performanceMetrics: {
    timeToFirstApplication: {
      type: Number,
      default: 0
    },
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    marketCompetitiveness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
jobAnalyticsSchema.index({ jobId: 1 });
jobAnalyticsSchema.index({ totalViews: -1 });
jobAnalyticsSchema.index({ applicationRate: -1 });
jobAnalyticsSchema.index({ lastUpdated: -1 });

// Company Analytics Schema - company-level analytics
const companyAnalyticsSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  totalJobPostings: {
    type: Number,
    default: 0
  },
  activeJobPostings: {
    type: Number,
    default: 0
  },
  totalApplications: {
    type: Number,
    default: 0
  },
  totalHires: {
    type: Number,
    default: 0
  },
  averageTimeToHire: {
    type: Number,
    default: 0
  },
  hiringSuccessRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  candidateQualityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  brandEngagement: {
    profileViews: {
      type: Number,
      default: 0
    },
    jobViews: {
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
  recruitmentMetrics: {
    costPerHire: {
      type: Number,
      default: 0
    },
    sourceEffectiveness: [{
      source: String,
      applications: Number,
      hires: Number,
      cost: Number,
      roi: Number
    }],
    pipelineMetrics: {
      totalCandidates: Number,
      screenedCandidates: Number,
      interviewedCandidates: Number,
      offeredCandidates: Number,
      hiredCandidates: Number
    }
  },
  marketPosition: {
    industryRank: Number,
    competitorComparison: [{
      competitor: String,
      metric: String,
      ourValue: Number,
      theirValue: Number,
      difference: Number
    }],
    marketShare: Number
  },
  aiPerformance: {
    matchAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    recommendationEffectiveness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    timeSaved: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
companyAnalyticsSchema.index({ companyId: 1 });
companyAnalyticsSchema.index({ hiringSuccessRate: -1 });
companyAnalyticsSchema.index({ totalJobPostings: -1 });
companyAnalyticsSchema.index({ lastUpdated: -1 });

// Market Intelligence Schema - market trends and insights
const marketIntelligenceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  dataType: {
    type: String,
    required: true,
    enum: [
      'skill_demand', 'salary_trends', 'job_market', 'industry_growth',
      'location_trends', 'company_growth', 'candidate_supply', 'hiring_patterns'
    ]
  },
  industry: String,
  location: String,
  skill: String,
  jobType: String,
  experienceLevel: String,
  metrics: {
    demand: Number,
    supply: Number,
    averageSalary: Number,
    medianSalary: Number,
    growthRate: Number,
    competitionIndex: Number,
    marketSize: Number,
    trendDirection: {
      type: String,
      enum: ['up', 'down', 'stable']
    }
  },
  insights: [{
    type: String,
    description: String,
    confidence: Number,
    impact: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  predictions: [{
    timeframe: {
      type: String,
      enum: ['1_month', '3_months', '6_months', '1_year']
    },
    prediction: String,
    confidence: Number,
    factors: [String]
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
marketIntelligenceSchema.index({ date: -1, dataType: 1 });
marketIntelligenceSchema.index({ industry: 1, date: -1 });
marketIntelligenceSchema.index({ skill: 1, date: -1 });
marketIntelligenceSchema.index({ location: 1, date: -1 });

// AI Performance Schema - AI system performance metrics
const aiPerformanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  modelType: {
    type: String,
    required: true,
    enum: [
      'resume_parser', 'job_matcher', 'recommendation_engine',
      'skill_extractor', 'sentiment_analyzer', 'text_classifier'
    ]
  },
  performanceMetrics: {
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    precision: {
      type: Number,
      min: 0,
      max: 100
    },
    recall: {
      type: Number,
      min: 0,
      max: 100
    },
    f1Score: {
      type: Number,
      min: 0,
      max: 100
    },
    processingTime: Number,
    throughput: Number,
    errorRate: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  usageStats: {
    totalRequests: Number,
    successfulRequests: Number,
    failedRequests: Number,
    averageResponseTime: Number,
    peakUsage: Number
  },
  feedbackMetrics: {
    userSatisfaction: {
      type: Number,
      min: 0,
      max: 100
    },
    clickThroughRate: {
      type: Number,
      min: 0,
      max: 100
    },
    conversionRate: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendationAccuracy: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  improvements: [{
    area: String,
    currentValue: Number,
    targetValue: Number,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    estimatedImpact: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
aiPerformanceSchema.index({ date: -1, modelType: 1 });
aiPerformanceSchema.index({ modelType: 1, date: -1 });

// Dashboard Configuration Schema - customizable dashboard settings
const dashboardConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dashboardType: {
    type: String,
    required: true,
    enum: ['admin', 'recruiter', 'job_seeker', 'company_admin']
  },
  widgets: [{
    widgetType: {
      type: String,
      required: true,
      enum: [
        'metric_card', 'line_chart', 'bar_chart', 'pie_chart', 'table',
        'funnel_chart', 'heatmap', 'trend_analysis', 'comparison_chart',
        'kpi_dashboard', 'performance_summary', 'ai_insights'
      ]
    },
    title: String,
    position: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    refreshInterval: {
      type: Number,
      default: 300 // 5 minutes
    }
  }],
  layout: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  preferences: {
    theme: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'auto']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    dateRange: {
      type: String,
      default: '30_days',
      enum: ['7_days', '30_days', '90_days', '1_year', 'custom']
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
dashboardConfigSchema.index({ userId: 1, dashboardType: 1 });

// Report Template Schema - predefined report templates
const reportTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: [
      'recruitment', 'performance', 'market_analysis', 'ai_insights',
      'financial', 'operational', 'compliance', 'custom'
    ]
  },
  targetAudience: {
    type: String,
    required: true,
    enum: ['admin', 'recruiter', 'hiring_manager', 'executive', 'all']
  },
  dataSources: [{
    type: String,
    enum: ['analytics_events', 'user_analytics', 'job_analytics', 'company_analytics', 'market_intelligence', 'ai_performance']
  }],
  metrics: [{
    name: String,
    type: {
      type: String,
      enum: ['count', 'sum', 'average', 'percentage', 'trend', 'comparison']
    },
    calculation: String,
    format: String
  }],
  filters: [{
    field: String,
    type: {
      type: String,
      enum: ['date_range', 'dropdown', 'multi_select', 'text', 'number']
    },
    options: [String],
    required: Boolean,
    defaultValue: mongoose.Schema.Types.Mixed
  }],
  visualization: {
    chartType: {
      type: String,
      enum: ['table', 'line_chart', 'bar_chart', 'pie_chart', 'funnel_chart', 'heatmap']
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  schedule: {
    enabled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly']
    },
    recipients: [String],
    format: {
      type: String,
      enum: ['pdf', 'excel', 'csv', 'json']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
reportTemplateSchema.index({ category: 1, targetAudience: 1 });
reportTemplateSchema.index({ isActive: 1 });
reportTemplateSchema.index({ createdBy: 1 });

// Export all models
module.exports = {
  AnalyticsEvent: mongoose.model('AnalyticsEvent', analyticsEventSchema),
  AnalyticsMetrics: mongoose.model('AnalyticsMetrics', analyticsMetricsSchema),
  UserAnalytics: mongoose.model('UserAnalytics', userAnalyticsSchema),
  JobAnalytics: mongoose.model('JobAnalytics', jobAnalyticsSchema),
  CompanyAnalytics: mongoose.model('CompanyAnalytics', companyAnalyticsSchema),
  MarketIntelligence: mongoose.model('MarketIntelligence', marketIntelligenceSchema),
  AIPerformance: mongoose.model('AIPerformance', aiPerformanceSchema),
  DashboardConfig: mongoose.model('DashboardConfig', dashboardConfigSchema),
  ReportTemplate: mongoose.model('ReportTemplate', reportTemplateSchema)
};
