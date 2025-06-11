// client/src/api/auth.js
import api from './api';

export const registerUser = async ({ username, email, rollNumber, password }) => {
    try {
        const response = await api.post('/api/auth/register', { username, email, rollNumber, password });
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed.';
        const code = error.response?.data?.code; // e.g., 'EMAIL_EXISTS', 'ROLL_NUMBER_EXISTS'
        return { success: false, message, code, status: error.response?.status };
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const response = await api.post('/api/auth/verify-otp', { email, otp });
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'OTP verification failed.';
        const code = error.response?.data?.code; // e.g., 'INVALID_OR_EXPIRED_OTP', 'USER_NOT_FOUND', 'ALREADY_VERIFIED'
        return { success: false, message, code, status: error.response?.status };
    }
};

export const loginUser = async ({email, password}) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed.';
        const code = error.response?.data?.code; // e.g., 'USER_NOT_FOUND', 'INVALID_CREDENTIALS', 'ACCOUNT_NOT_VERIFIED'
        // Pass requiresVerification flag directly from backend if available
        const requiresVerification = error.response?.data?.requiresVerification || false;
        const emailForVerification = error.response?.data?.email;
        return { success: false, message, code, status: error.response?.status, requiresVerification, email: emailForVerification };
    }
};

export const resendOtp = async (email) => {
    try {
        const response = await api.post('/api/auth/resend-otp', { email });
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || 'Resending OTP failed.';
        const code = error.response?.data?.code; // e.g., 'USER_NOT_FOUND', 'ALREADY_VERIFIED'
        return { success: false, message, code, status: error.response?.status };
    }
};