import axios from 'axios';

const API_BASE_URL = 'https://resumeanalyser-ahbp.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Returns existing userId from localStorage or creates and stores a new one
export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('resumeAnalyzerUserId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('resumeAnalyzerUserId', userId);
  }
  return userId;
};

export const resumeAPI = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    // Attach userId so backend can scope the record to this browser session
    formData.append('userId', getOrCreateUserId());

    const response = await api.post('/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getResumeHistory: async (page = 1, limit = 10) => {
    const userId = getOrCreateUserId();
    const response = await api.get(`/resume-history?page=${page}&limit=${limit}&userId=${userId}`);
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;