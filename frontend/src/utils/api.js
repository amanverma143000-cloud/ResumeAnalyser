import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const resumeAPI = {
  // Upload resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get resume history
  getResumeHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/resume-history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single resume
  getResumeById: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;