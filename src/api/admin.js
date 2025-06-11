// client/src/api/admin.js
import api from './api'; // Ensure you have this configured (base Axios instance)

// --- Riddle Management ---
export const addRiddle = async (riddleData) => {
    const response = await api.post('/api/admin/riddles', riddleData);
    return response.data;
};

export const getAllRiddles = async () => {
    const response = await api.get('/api/admin/riddles');
    return response.data;
};

// --- Folder Management ---
export const addFolder = async (folderData) => {
    const response = await api.post('/api/admin/folders', folderData);
    return response.data;
};

export const getAllFolders = async () => {
    const response = await api.get('/api/admin/folders');
    return response.data;
};

// --- User Management ---
export const getAllUsers = async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
};

export const toggleAdminStatus = async (userId) => {
    const response = await api.put(`/api/admin/users/${userId}/toggle-admin`);
    return response.data;
};

// --- Leaderboard ---
export const getLeaderboard = async () => {
    try {
        const response = await api.get('/api/admin/leaderboard');
        return response.data;
    } catch (error) {
        console.error('API Error: Failed to fetch leaderboard:', error.response?.data?.message || error.message);
        throw error; // Re-throw to be caught by the calling component
    }
};

// You might also need update/delete functions for riddles/folders/users later
// export const updateRiddle = async (id, riddleData) => { ... };
// export const deleteRiddle = async (id) => { ... };
// export const updateFolder = async (id, folderData) => { ... };
// export const deleteFolder = async (id) => { ... };