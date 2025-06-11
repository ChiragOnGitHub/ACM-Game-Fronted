import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast'; // Import toast
import './AuthForms.css'; // Your shared CSS

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Use the login function from useAuth
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Email and password are required.');
            return;
        }

        try {
            const result = await login(email, password); // Calling login from useAuth

            if (result.success) {
                toast.success(result.message); // "Login successful!"
                // Fix for navigation issue: Use replace: true and ensure delay is appropriate
                navigate('/game', { replace: true }); 
            } else {
                // Use the specific codes returned from useAuth (which come from backend)
                switch (result.code) {
                    case 'USER_NOT_FOUND':
                        toast.error('User with this email does not exist. Please sign up or check your email.');
                        break;
                    case 'INVALID_CREDENTIALS':
                        toast.error('Incorrect password. Please try again.');
                        break;
                    case 'ACCOUNT_NOT_VERIFIED':
                        toast('Your account is not verified. A new OTP has been sent to your email.', { 
                            icon: 'ℹ️', // This provides an info-like icon
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            },
                        });
                        // Redirect to OTP verification page, passing email via state
                        navigate(`/verify-otp/${encodeURIComponent(email)}`); 
                        break;
                    default:
                        toast.error(result.message || 'Login failed. Please try again.');
                }
            }
        } catch (err) {
            console.error('Login form submission error:', err);
            // Catch network errors or unhandled server errors
            toast.error('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/signup')} className="auth-link">
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;