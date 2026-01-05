import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Schedule API
export const scheduleAPI = {
  generate: (userProfile) => api.post('/schedule/generate', userProfile),
  get: (userId) => api.get(`/schedule/${userId}`),
  updateItem: (userId, itemId, updates) => 
    api.put(`/schedule/${userId}/item/${itemId}`, updates),
  applyFallback: (userId, disruption) => 
    api.post(`/schedule/${userId}/fallback`, { disruption }),
  refine: (userId, feedback) => 
    api.post(`/schedule/${userId}/refine`, { feedback }),
};

// Goals API
export const goalsAPI = {
  get: (userId) => api.get(`/goals/${userId}`),
  create: (userId, goalData) => api.post(`/goals/${userId}`, goalData),
  update: (userId, goalId, updates) => 
    api.put(`/goals/${userId}/${goalId}`, updates),
  delete: (userId, goalId) => api.delete(`/goals/${userId}/${goalId}`),
};

// WhatsApp API
export const whatsappAPI = {
  startOnboarding: (phoneNumber) => 
    api.post('/whatsapp/start-onboarding', { phoneNumber }),
  send: (to, message) => api.post('/whatsapp/send', { to, message }),
  getConversation: (phoneNumber) => 
    api.get(`/whatsapp/conversation/${phoneNumber}`),
};

// Calendar API
export const calendarAPI = {
  syncToGoogle: (schedule, userCredentials) => 
    api.post('/calendar/sync/google', { schedule, userCredentials }),
  exportICal: (schedule) => 
    api.post('/calendar/export/ical', { schedule }, { responseType: 'blob' }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
