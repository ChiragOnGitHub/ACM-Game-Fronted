// client/src/api/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || process.env.REACT_APP_BASE_URL, // Backend server URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor to add the JWT token to headers
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

// Response interceptor to handle token expiration (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the error response status is 401 (Unauthorized) and it's not a login attempt
        if (error.response && error.response.status === 401 && !error.config.url.includes('/api/auth/login')) {
            // console.log('Token expired or invalid. Logging out...');
            localStorage.removeItem('token');
            // Redirect to login page or home page
            // This needs to be handled outside the interceptor as it can't access React Router directly.
            // You might dispatch a logout action here if using Redux, or rely on `useAuth` hook to detect token absence.
            window.location.href = '/login'; // Force reload and redirect
        }
        return Promise.reject(error);
    }
);

export default api;