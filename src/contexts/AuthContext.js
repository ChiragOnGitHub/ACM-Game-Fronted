// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login, register, verifyOtp, resendOtp } from '../api/auth';
import { jwtDecode } from 'jwt-decode'; // npm i jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        id: decoded.id,
                        isAdmin: decoded.isAdmin,
                        // You might fetch more user details here if needed
                    });
                }
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const handleLogin = async (credentials) => {
        const response = await login(credentials);
        if (response.token) {
            localStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response.user);
            return { success: true };
        } else if (response.requiresVerification) {
            // Handle case where login needs OTP verification
            return { success: false, requiresVerification: true, email: response.email };
        }
        return { success: false, message: response.message || 'Login failed.' };
    };

    const handleRegister = async (userData) => {
        const response = await register(userData);
        if (response.userId) {
            // Registration successful, OTP sent
            return { success: true, email: response.email };
        }
        return { success: false, message: response.message || 'Registration failed.' };
    };

    const handleVerifyOtp = async (email, otp) => {
        const response = await verifyOtp({ email, otp });
        if (response.token) {
            localStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response.user);
            return { success: true };
        }
        return { success: false, message: response.message || 'OTP verification failed.' };
    };

    const handleResendOtp = async (email) => {
        const response = await resendOtp({ email });
        return { success: response.message, message: response.message };
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login: handleLogin,
                register: handleRegister,
                verifyOtp: handleVerifyOtp,
                resendOtp: handleResendOtp,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;