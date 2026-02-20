import axios from 'axios';
import { auth } from '../firebase';

// Dynamically determine the base URL
// Use VITE_API_URL if defined, otherwise fallback to localhost for development, or the production render URL depending on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://ninja-penguin-backend-1.onrender.com');

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests and attach Firebase auth token if available
apiClient.interceptors.request.use(async (config) => {
    if (auth.currentUser) {
        // True "forceRefresh" isn't strictly necessary here unless we suspect it's expired
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Admin Log Services
export const logAdminAction = async (adminEmail, action, details = {}) => {
    try {
        const response = await apiClient.post('/api/admin-log', {
            adminEmail,
            action,
            details,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to log admin action:', error);
        throw error;
    }
};

export const fetchAdminLogs = async (email) => {
    try {
        const response = await apiClient.get(`/api/admin-logs?email=${encodeURIComponent(email)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin logs:', error);
        throw error;
    }
};

// Document Services
export const generateDocument = async (payload) => {
    try {
        const response = await apiClient.post('/test', payload);
        return response.data;
    } catch (error) {
        console.error('Error generating document:', error);
        throw error;
    }
};

export const sendRejectionEmail = async (payload) => {
    try {
        const response = await apiClient.post('/send-rejection-email', payload);
        return response.data;
    } catch (error) {
        console.error('Error sending rejection email:', error);
        throw error;
    }
};
