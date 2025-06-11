// client/src/api/game.js
import api from './api'; // Ensure this path is correct

export const getGameState = async () => {
    const response = await api.get('/api/game/state');
    return response.data;
};

export const getFolderDetails = async (folderId) => {
    const response = await api.get(`/api/game/folder/${folderId}`);
    return response.data;
};

export const submitAnswer = async (folderId, answer) => {
    const response = await api.post(`/api/game/answer/${folderId}`, { answer });
    // console.log(response);
    return response.data;
};

export const getAllFolders = async () => {
    const response = await api.get('/api/game/folders');
    return response.data;
};