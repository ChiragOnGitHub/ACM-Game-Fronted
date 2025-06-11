import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast'; // Import toast
import './AuthForms.css'; // Your shared CSS

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth(); // Use the register function from useAuth
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation for empty fields (important for UX)
        if (!username || !email || !rollNumber || !password) {
            toast.error('All fields are required.');
            return;
        }

        try {
            const result = await register(username, email, rollNumber, password);

            if (result.success) {
                toast.success(result.message); // Display success message from backend
                // Redirect to OTP verification with email as URL param
                navigate(`/verify-otp/${encodeURIComponent(email)}`); 
            } else {
                // Use the specific codes returned from useAuth (which come from backend)
                switch (result.code) {
                    case 'EMAIL_EXISTS':
                        toast.error('This email is already registered. Please log in.');
                        break;
                    case 'ROLL_NUMBER_EXISTS':
                        toast.error('This roll number is already registered.');
                        break;
                    default:
                        toast.error(result.message || 'Registration failed. Please try again.');
                }
            }
        } catch (err) {
            console.error('Signup form submission error:', err);
            toast.error('An unexpected error occurred during registration. Please try again later.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                        <label htmlFor="rollNumber">Roll Number:</label>
                        <input
                            type="text"
                            id="rollNumber"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
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
                    <button type="submit" className="auth-button">Sign Up</button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className="auth-link">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Signup;