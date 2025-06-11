import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast'; // Import toast
import './AuthForms.css'; // Your shared CSS

function OTPVerification() {
    const { email: emailFromParams } = useParams();
    const location = useLocation();
    const emailFromState = location.state?.email;
    
    // Prioritize URL param, then state, otherwise null
    const email = emailFromParams || emailFromState || null; 

    const [otp, setOtp] = useState('');
    const { verifyOTP, resendOTP } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email is missing for OTP verification. Please go back to login or signup.');
            return;
        }
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP.');
            return;
        }

        try {
            const result = await verifyOTP(email, otp);
            if (result.success) {
                if (result.alreadyVerified) {
                    toast('This account is already verified. Redirecting to login.', { icon: 'ℹ️' });
                } else {
                    toast.success(result.message); // "Account verified successfully! You can now log in."
                }
                // Always redirect to login page after successful verification (or if already verified)
                navigate('/login'); 
            } else {
                // Use the specific codes returned from useAuth (which come from backend)
                switch (result.code) {
                    case 'INVALID_OR_EXPIRED_OTP':
                        toast.error('The OTP you entered is invalid or has expired. Please try again or resend.');
                        break;
                    case 'USER_NOT_FOUND':
                        toast.error('User not found for this email. Please check your email or sign up.');
                        break;
                    default:
                        toast.error(result.message || 'OTP verification failed. Please try again.');
                }
            }
        } catch (err) {
            console.error('OTP verification form submission error:', err);
            toast.error('An unexpected error occurred during OTP verification.');
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Email is missing. Cannot resend OTP.');
            return;
        }

        try {
            const result = await resendOTP(email);
            if (result.success) {
                toast.success(result.message); // "New OTP sent to your email."
            } else {
                switch (result.code) {
                    case 'USER_NOT_FOUND':
                        toast.error('User not found for this email. Please check your email.');
                        break;
                    case 'ALREADY_VERIFIED':
                        toast('This account is already verified. No need to resend OTP.', { icon: 'ℹ️' });
                        break;
                    default:
                        toast.error(result.message || 'Failed to resend OTP. Please try again.');
                }
            }
        } catch (err) {
            console.error('Resend OTP error:', err);
            toast.error('An unexpected error occurred while trying to resend OTP.');
        }
    };

    if (!email) {
        return (
            <div className="auth-container">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'red', marginBottom: '20px' }}>
                        Error: Email not provided for OTP verification. Please sign up or log in again.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="auth-button"
                        style={{ marginTop: '20px' }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Verify OTP</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                    An OTP has been sent to your email: <strong style={{ color: '#007bff' }}>{email}</strong>
                </p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <label htmlFor="otp">Enter OTP:</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength="6"
                        />
                    </div>
                    <button type="submit" className="auth-button">Verify</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Didn't receive OTP?{' '}
                    <span onClick={handleResend} className="auth-link">
                        Resend OTP
                    </span>
                </p>
            </div>
        </div>
    );
}

export default OTPVerification;