// client/src/components/Admin/LeaderboardDisplay.js
import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../api/admin'; // Correct import path
import io from 'socket.io-client'; // Import Socket.IO client
import './LeaderboardDisplay.css'; // Optional styling for your table

function LeaderboardDisplay() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getLeaderboard();
            setLeaderboard(data); // The backend now handles sorting
            setLoading(false);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError(err.response?.data?.message || 'Failed to fetch leaderboard data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        // Socket.IO setup for real-time updates
        const socket = io(process.env.REACT_APP_BASE_URL); // Connect to your backend Socket.IO server
        // console.log('Attempting to connect to Socket.IO from LeaderboardDisplay...');

        socket.on('connect', () => {
            // console.log('Socket.IO connected to LeaderboardDisplay');
        });

        socket.on('leaderboardUpdate', (data) => {
            // console.log('Leaderboard update received via Socket.IO:', data);
            // Re-fetch the entire leaderboard to get the latest sorted data
            // This is simpler than trying to update individual entries on the client
            fetchLeaderboard();
        });

        socket.on('disconnect', () => {
            // console.log('Socket.IO disconnected from LeaderboardDisplay');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket.IO connection error in LeaderboardDisplay:', err);
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
            // console.log('Socket.IO disconnected from LeaderboardDisplay on unmount.');
        };
    }, []); // Empty dependency array means this runs once on mount/unmount

    if (loading) {
        return <div className="leaderboard-display">Loading leaderboard...</div>;
    }

    if (error) {
        return <div className="leaderboard-display error-message">{error}</div>;
    }

    return (
        <div className="leaderboard-display">
            <h2>Leaderboard</h2>
            {leaderboard.length === 0 ? (
                <p>No leaderboard data available yet.</p>
            ) : (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Roll Number</th> {/* Added Roll Number */}
                            <th>Unlocked Folders</th>
                            <th>Score</th> {/* Display the computed score */}
                            <th>Completion Time</th> {/* Renamed from Last Activity for clarity */}
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, index) => (
                            <tr key={entry.userId}>
                                <td>{index + 1}</td>
                                <td>{entry.username}</td>
                                <td>{entry.rollNumber}</td> {/* Display Roll Number */}
                                <td>{entry.unlockedFolders}</td>
                                <td>{entry.score}</td> {/* Display Score */}
                                <td>
                                    {entry.lastCompletionTime
                                        ? new Date(entry.lastCompletionTime).toLocaleString()
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default LeaderboardDisplay;