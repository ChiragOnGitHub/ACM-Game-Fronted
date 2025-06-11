// client/src/components/Admin/FolderForm.js
import React, { useState } from 'react';
import { addFolder } from '../../api/admin';

function FolderForm({ riddles, folders, onFolderAdded }) {
    const [name, setName] = useState('');
    const [order, setOrder] = useState('');
    const [riddleId, setRiddleId] = useState('');
    const [dependencies, setDependencies] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleDependencyChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setDependencies(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const newFolder = {
                name,
                order: Number(order),
                riddleId,
                dependencies,
            };
            const response = await addFolder(newFolder);
            setMessage(response.message);
            onFolderAdded(); // Notify parent to refresh
            // Clear form
            setName('');
            setOrder('');
            setRiddleId('');
            setDependencies([]);
        } catch (err) {
            console.error('Error adding folder:', err);
            setError(err.response?.data?.message || 'Failed to add folder.');
        }
    };

    return (
        <div className="admin-form-card">
            <h3>Add New Folder</h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Folder Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Display Order:</label>
                    <input
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Associated Riddle:</label>
                    <select
                        value={riddleId}
                        onChange={(e) => setRiddleId(e.target.value)}
                        required
                    >
                        <option value="">-- Select a riddle --</option>
                        {riddles.map(r => (
                            <option key={r._id} value={r._id}>{r.question.substring(0, 50)}...</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Dependencies (Ctrl/Cmd + click to select multiple):</label>
                    <select
                        multiple
                        value={dependencies}
                        onChange={handleDependencyChange}
                        size="5" // Show more options
                    >
                        {folders.map(f => (
                            <option key={f._id} value={f._id}>{f.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Add Folder</button>
            </form>
        </div>
    );
}

export default FolderForm;