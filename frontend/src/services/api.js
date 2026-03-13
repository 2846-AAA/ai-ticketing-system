/**
 * API Service for communicating with Django REST Framework backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Ticket API endpoints
export const ticketAPI = {
  // Get all tickets
  getAllTickets: (params = {}) => api.get('/tickets/', { params }),
  
  // Get single ticket
  getTicket: (id) => api.get(`/tickets/${id}/`),
  
  // Create new ticket
  createTicket: (data) => api.post('/tickets/', data),
  
  // Update ticket
  updateTicket: (id, data) => api.patch(`/tickets/${id}/`, data),
  
  // Delete ticket
  deleteTicket: (id) => api.delete(`/tickets/${id}/`),
  
  // Get my tickets
  getMyTickets: () => api.get('/tickets/my_tickets/'),
  
  // Get tickets assigned to me
  getAssignedToMe: () => api.get('/tickets/assigned_to_me/'),
  
  // Get statistics
  getStatistics: () => api.get('/tickets/statistics/'),
  
  // Auto-route ticket
  autoRoute: (id) => api.post(`/tickets/${id}/auto_route/`),
  
  // Reanalyze ticket with NLP
  reanalyzeTicket: (id) => api.post(`/tickets/${id}/reanalyze/`),
};

// Comment API endpoints
export const commentAPI = {
  // Get comments for a ticket
  getComments: (ticketId) => api.get('/comments/', { params: { ticket_id: ticketId } }),
  
  // Create comment
  createComment: (data) => api.post('/comments/', data),
  
  // Delete comment
  deleteComment: (id) => api.delete(`/comments/${id}/`),
};

// History API endpoints
export const historyAPI = {
  // Get history for a ticket
  getHistory: (ticketId) => api.get('/history/', { params: { ticket_id: ticketId } }),
};

// User API endpoints
export const userAPI = {
  // Get current user
  getCurrentUser: () => api.get('/users/me/'),
  
  // Get all users
  getAllUsers: () => api.get('/users/'),
  
  // Get all agents
  getAgents: () => api.get('/users/agents/'),
};

export default api;
