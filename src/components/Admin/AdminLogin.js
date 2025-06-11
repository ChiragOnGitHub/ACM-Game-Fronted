// client/src/components/Admin/AdminLogin.js
import React, { useState } from 'react';
import { adminLogin } from '../../api/admin'; // Create admin login API
import { useAuth } from '../../hooks/useAuth'; // Use the same auth context for token management

function AdminLogin({ onAdminLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Use the existing login function to set token/user

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Re-use the main login function, it will verify if user is admin via token
            const result = await login({ email, password });
            if (result.success && result.user.isAdmin) {
                onAdminLogin(); // Notify parent AdminPage
            } else if (result.success && !result.user.isAdmin) {
                setError('You do not have administrative privileges.');
                // Optionally, log out the non-admin user from admin panel context
                // logout(); // This is for main app logout, not just admin panel access
            } else {
                setError(result.message || 'Admin login failed.');
            }
        } catch (err) {
            console.error('Admin login error:', err);
            setError('An error occurred. Please check credentials.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                <div>
                    <label htmlFor="adminEmail">Email:</label>
                    <input
                        type="email"
                        id="adminEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="adminPassword">Password:</label>
                    <input
                        type="password"
                        id="adminPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Admin Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;