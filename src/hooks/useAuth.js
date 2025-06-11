import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyOtp, resendOtp } from '../api/auth'; // Removed checkExistence as per current backend
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Ensure decoded token has the fields you expect (e.g., username, email, isAdmin)
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('Token expired.');
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                } else {
                    // Populate user object from decoded token for global access
                    setUser({ id: decoded.id, username: decoded.username, email: decoded.email, isAdmin: decoded.isAdmin });
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to decode token or token invalid:', error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
        setLoading(false); // Authentication check complete
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const result = await loginUser({ email, password }); // Pass as object for consistency
            if (result.success) {
                localStorage.setItem('token', result.data.token);
                const decoded = jwtDecode(result.data.token);
                setUser({ id: decoded.id, username: decoded.username, email: decoded.email, isAdmin: decoded.isAdmin });
                setIsAuthenticated(true);
                setLoading(false);
                return { success: true, message: result.data.message || 'Login successful!' };
            } else {
                setLoading(false);
                // Return specific error information for the frontend to handle
                return {
                    success: false,
                    message: result.message,
                    code: result.code,
                    requiresVerification: result.requiresVerification,
                    email: result.email // email might be needed for redirection to OTP
                };
            }
        } catch (error) {
            setLoading(false);
            console.error('Login error in useAuth:', error);
            return { success: false, message: 'An unexpected network error occurred during login.' };
        }
    };

    const register = async (username, email, rollNumber, password) => {
        setLoading(true);
        try {
            const result = await registerUser({ username, email, rollNumber, password }); // Pass as object for consistency
            if (result.success) {
                setLoading(false);
                return { success: true, message: result.data.message, email: email }; // Return email for OTP redirection
            } else {
                setLoading(false);
                // Return specific error codes/messages from backend
                return { success: false, message: result.message, code: result.code };
            }
        } catch (error) {
            setLoading(false);
            console.error('Registration error in useAuth:', error);
            return { success: false, message: 'An unexpected network error occurred during registration.' };
        }
    };

    const verifyOTP = async (email, otp) => {
        setLoading(true);
        try {
            const result = await verifyOtp(email, otp);
            setLoading(false);
            if (result.success) {
                // If backend sent alreadyVerified flag
                if (result.data.alreadyVerified) {
                    return { success: true, message: result.data.message, alreadyVerified: true };
                }
                return { success: true, message: result.data.message };
            } else {
                setLoading(false);
                return { success: false, message: result.message, code: result.code };
            }
        } catch (error) {
            setLoading(false);
            console.error('OTP verification error in useAuth:', error);
            return { success: false, message: 'An unexpected network error occurred during OTP verification.' };
        }
    };

    const resendOTP = async (email) => {
        setLoading(true);
        try {
            const result = await resendOtp(email);
            if (result.success) {
                setLoading(false);
                return { success: true, message: result.data.message };
            } else {
                setLoading(false);
                return { success: false, message: result.message, code: result.code };
            }
        } catch (error) {
            setLoading(false);
            console.error('Resend OTP error in useAuth:', error);
            return { success: false, message: 'An unexpected network error occurred while resending OTP.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const authContextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};