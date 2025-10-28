import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Job API
export const jobAPI = {
  // Get all jobs with filters
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Search jobs
  searchJobs: async (searchData) => {
    const response = await api.post('/jobs/search', searchData);
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Get jobs by recruiter
  getJobsByRecruiter: async (recruiterId, params = {}) => {
    const response = await api.get(`/jobs/recruiter/${recruiterId}`, { params });
    return response.data;
  },

  // Get job applications
  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/jobs/${jobId}/applications`, { params });
    return response.data;
  },

  // Get job statistics
  getJobStats: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/stats`);
    return response.data;
  },
};

// Application API
export const applicationAPI = {
  // Apply for job
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  // Get candidate applications
  getCandidateApplications: async (params = {}) => {
    const response = await api.get('/jobs/applications/candidate', { params });
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const response = await api.get(`/jobs/applications/${id}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/jobs/applications/${id}/status`, statusData);
    return response.data;
  },

  // Add recruiter note
  addRecruiterNote: async (id, noteData) => {
    const response = await api.post(`/jobs/applications/${id}/notes`, noteData);
    return response.data;
  },

  // Schedule interview
  scheduleInterview: async (id, interviewData) => {
    const response = await api.post(`/jobs/applications/${id}/interviews`, interviewData);
    return response.data;
  },

  // Update interview feedback
  updateInterviewFeedback: async (id, interviewId, feedbackData) => {
    const response = await api.put(`/jobs/applications/${id}/interviews/${interviewId}/feedback`, feedbackData);
    return response.data;
  },

  // Make job offer
  makeJobOffer: async (id, offerData) => {
    const response = await api.post(`/jobs/applications/${id}/offer`, offerData);
    return response.data;
  },

  // Respond to job offer
  respondToOffer: async (id, responseData) => {
    const response = await api.put(`/jobs/applications/${id}/offer/respond`, responseData);
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (id) => {
    const response = await api.put(`/jobs/applications/${id}/withdraw`);
    return response.data;
  },

  // Get application statistics
  getApplicationStats: async () => {
    const response = await api.get('/jobs/applications/stats/recruiter');
    return response.data;
  },
};

// Types for TypeScript
export interface Job {
  _id: string;
  title: string;
  description: string;
  company: {
    _id: string;
    name: string;
    logo?: string;
    industry?: string;
    size?: string;
  };
  recruiter: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  workMode: 'remote' | 'onsite' | 'hybrid';
  location: {
    city: string;
    state: string;
    country: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
    negotiable: boolean;
  };
  requirements: {
    experience: {
      min: number;
      max?: number;
      level: 'entry' | 'mid' | 'senior' | 'executive';
    };
    education: string;
    skills: Array<{
      name: string;
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      required: boolean;
    }>;
  };
  benefits: string[];
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  visibility: 'public' | 'private' | 'internal';
  analytics: {
    views: number;
    applications: number;
    saves: number;
    shares: number;
  };
  postedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  job: Job;
  candidate: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    skills: string[];
    experience: string;
  };
  recruiter: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  company: {
    _id: string;
    name: string;
    logo?: string;
  };
  status: 'applied' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'offer_made' | 'offer_accepted' | 'offer_declined' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  portfolio?: {
    url: string;
    description: string;
  };
  aiMatch: {
    overallScore: number;
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    salaryMatch: number;
  };
  recruiterNotes: Array<{
    note: string;
    addedBy: string;
    addedAt: string;
    isPrivate: boolean;
  }>;
  interviews: Array<{
    _id: string;
    scheduledAt: string;
    duration: number;
    type: 'phone' | 'video' | 'in-person' | 'technical' | 'panel';
    location?: string;
    meetingLink?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    feedback?: {
      rating: number;
      notes: string;
      strengths: string[];
      weaknesses: string[];
      recommendation: 'strong_hire' | 'hire' | 'no_hire' | 'strong_no_hire';
    };
  }>;
  offer?: {
    salary: {
      amount: number;
      currency: string;
      period: string;
    };
    startDate: string;
    benefits: string[];
    notes: string;
    expiresAt: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchFilters {
  query?: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string;
  skills?: string[];
  company?: string;
  benefits?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  jobType: string;
  workMode: string;
  location: {
    city: string;
    state: string;
    country?: string;
  };
  salary: {
    min: number;
    max: number;
    currency?: string;
    period?: string;
    negotiable?: boolean;
  };
  requirements: {
    experience: {
      min: number;
      max?: number;
      level: string;
    };
    education?: string;
    skills?: Array<{
      name: string;
      level: string;
      required: boolean;
    }>;
  };
  benefits?: string[];
  applicationProcess?: {
    deadline?: string;
    instructions?: string;
    requiredDocuments?: string[];
  };
  status?: string;
  visibility?: string;
}

export interface ApplicationData {
  coverLetter?: string;
  portfolio?: {
    url: string;
    description: string;
  };
  customQuestions?: Array<{
    question: string;
    answer: string;
  }>;
}

export default api;
