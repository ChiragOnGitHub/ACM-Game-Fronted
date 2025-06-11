// client/src/components/Admin/AdminDashboard.js (No changes needed based on the provided code)
import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';
import FolderForm from './FolderForm';
import UserManagement from './UserManagement';
import LeaderboardDisplay from './LeaderboardDisplay'; // This component will now show the updated data
import { getAllRiddles, getAllFolders } from '../../api/admin';
import './AdminDashboard.css';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('leaderboard'); // You might want to default to 'leaderboard' for easy viewing during development
    const [riddles, setRiddles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loadingRiddles, setLoadingRiddles] = useState(true);
    const [loadingFolders, setLoadingFolders] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRiddles();
        fetchFolders();
    }, []);

    const fetchRiddles = async () => {
        try {
            setLoadingRiddles(true);
            const data = await getAllRiddles();
            setRiddles(data);
            setLoadingRiddles(false);
        } catch (err) {
            console.error('Error fetching riddles:', err);
            setError('Failed to fetch riddles.');
            setLoadingRiddles(false);
        }
    };

    const fetchFolders = async () => {
        try {
            setLoadingFolders(true);
            const data = await getAllFolders();
            setFolders(data);
            setLoadingFolders(false);
        } catch (err) {
            console.error('Error fetching folders:', err);
            setError('Failed to fetch folders.');
            setLoadingFolders(false);
        }
    };

    const handleRiddleAdded = () => {
        fetchRiddles(); // Refresh list after adding
    };

    const handleFolderAdded = () => {
        fetchFolders(); // Refresh list after adding
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Panel</h1>
            {error && <p className="error-message">{error}</p>}
            <nav className="admin-tabs">
                <button onClick={() => setActiveTab('questions')} className={activeTab === 'questions' ? 'active' : ''}>
                    Manage Questions
                </button>
                <button onClick={() => setActiveTab('folders')} className={activeTab === 'folders' ? 'active' : ''}>
                    Manage Folders
                </button>
                <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>
                    Manage Users
                </button>
                <button onClick={() => setActiveTab('leaderboard')} className={activeTab === 'leaderboard' ? 'active' : ''}>
                    Leaderboard
                </button>
            </nav>

            <div className="tab-content">
                {activeTab === 'questions' && (
                    <QuestionForm
                        riddles={riddles}
                        onRiddleAdded={handleRiddleAdded}
                    />
                )}
                {activeTab === 'folders' && (
                    <FolderForm
                        riddles={riddles}
                        folders={folders}
                        onFolderAdded={handleFolderAdded}
                    />
                )}
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'leaderboard' && <LeaderboardDisplay />}
            </div>
        </div>
    );
}

export default AdminDashboard;