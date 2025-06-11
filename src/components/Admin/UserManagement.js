// client/src/components/Admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { getAllUsers, toggleAdminStatus } from '../../api/admin'; // API calls for user management
import './UserManagement.css'; // Optional styling

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('');
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Failed to fetch users.');
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (userId) => {
        try {
            setError('');
            setMessage('');
            const result = await toggleAdminStatus(userId);
            setMessage(result.message);
            fetchUsers(); // Refresh the list
        } catch (err) {
            console.error('Error toggling admin status:', err);
            setError(err.response?.data?.message || 'Failed to toggle admin status.');
        }
    };

    if (loading) {
        return <div className="user-management">Loading users...</div>;
    }

    if (error) {
        return <div className="user-management error-message">{error}</div>;
    }

    return (
        <div className="user-management">
            <h2>User Management</h2>
            {message && <p className="success-message">{message}</p>}
            {users.length === 0 ? (
                <p>No users found (apart from possibly yourself if you're the only admin).</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                <td>
                                    <button
                                        onClick={() => handleToggleAdmin(user._id)}
                                        className={user.isAdmin ? 'btn-remove-admin' : 'btn-make-admin'}
                                        disabled={user.isAdmin} // Optional: disable if already admin
                                    >
                                        {user.isAdmin ? 'Is Admin' : 'Make Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserManagement;