import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData: RegisterData) => 
    api.post('/auth/register', userData),
  
  login: (credentials: LoginData) => 
    api.post('/auth/login', credentials),
  
  getMe: () => 
    api.get('/auth/me'),
  
  logout: () => 
    api.get('/auth/logout'),
  
  updateDetails: (userData: UpdateUserData) => 
    api.put('/auth/updatedetails', userData),
  
  updatePassword: (passwordData: UpdatePasswordData) => 
    api.put('/auth/updatepassword', passwordData),
};

// User API calls
export const userAPI = {
  getUsers: () => 
    api.get('/users'),
  
  getUser: (id: string) => 
    api.get(`/users/${id}`),
  
  updateProfile: (profileData: UpdateProfileData) => 
    api.put('/users/profile', profileData),
  
  deleteUser: (id: string) => 
    api.delete(`/users/${id}`),
  
  getUserStats: () => 
    api.get('/users/stats'),
};

// Types
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  skills?: string[];
  experience?: string;
  company?: string;
  position?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  education?: Education[];
  resume?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  current: boolean;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'job_seeker' | 'recruiter' | 'admin';
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  skills?: string[];
  experience?: string;
  education?: Education[];
  location?: string;
  phone?: string;
  company?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}
