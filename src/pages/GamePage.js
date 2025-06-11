import React, { useState, useEffect } from 'react';
import FolderGrid from '../components/Game/FolderGrid';
import RiddleModal from '../components/Game/RiddleModal';
import { getGameState, getFolderDetails, submitAnswer, getAllFolders } from '../api/game';
import './GamePage.css';

function GamePage() {
    const [folders, setFolders] = useState([]);
    const [unlockedFolderIds, setUnlockedFolderIds] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [currentRiddle, setCurrentRiddle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [lastAttemptStatus, setLastAttemptStatus] = useState(null);
    const [showFinalSuccess, setShowFinalSuccess] = useState(false);


    useEffect(() => {
        fetchInitialGameData();
    }, []);

    const fetchInitialGameData = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('');
            setLastAttemptStatus(null);

            const allGameFolders = await getAllFolders();
            setFolders(allGameFolders);

            const userGameState = await getGameState();
            const unlockedIds = userGameState.unlockedFolders.map(uf => uf.folderId._id);
            setUnlockedFolderIds(unlockedIds);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching initial game data:', err);
            setError(err.response?.data?.message || 'Failed to load game.');
            setLoading(false);
        }
    };

    const isFolderAccessible = (folder) => {
        if (unlockedFolderIds.includes(folder._id)) return true;
        return folder.dependencies.every(depId => unlockedFolderIds.includes(depId));
    };

    const handleFolderClick = async (folderId) => {
        const folderToOpen = folders.find(f => f._id === folderId);
        if (!folderToOpen) {
            setError('Folder not found.');
            return;
        }

        setError('');
        setMessage('');
        setLastAttemptStatus(null);

        const isAccessible = isFolderAccessible(folderToOpen);
        if (!isAccessible) {
            setError('This folder is locked!');
            return;
        }

        setSelectedFolder(folderId);
        setIsModalOpen(true);

        try {
            const { riddle, isUnlocked } = await getFolderDetails(folderId);

            if (isUnlocked && !riddle) {
                setMessage('This folder has been fully completed!');
                setIsModalOpen(false);
                setSelectedFolder(null);
                setCurrentRiddle(null);
                return;
            }

            if (riddle) {
                setCurrentRiddle(riddle);
            } else {
                setError('No riddle found.');
                setIsModalOpen(false);
                setSelectedFolder(null);
                setCurrentRiddle(null);
            }

        } catch (err) {
            console.error('Error fetching folder details:', err);
            setError(err.response?.data?.message || 'Failed to load folder details.');
            setSelectedFolder(null);
            setIsModalOpen(false);
            setCurrentRiddle(null);
        }
    };

    const handleAnswerSubmit = async (folderId, answer) => {
        setError('');
        setMessage('');
        setLastAttemptStatus(null);

        try {
            const result = await submitAnswer(folderId, answer);

            if (result.unlocked) {
                setUnlockedFolderIds(prev => [...prev, folderId]);
                setLastAttemptStatus('folderUnlocked');
                setShowFinalSuccess(true);

                setTimeout(() => {
                    closeModal();
                }, 1000);

                await fetchInitialGameData();
                return 'folder-unlocked';
            } else if (result.nextRiddle) {
                setMessage(result.message || 'Correct! Next part...');
                setLastAttemptStatus('nested-correct');
                setCurrentRiddle(result.nextRiddle);
                return 'nested-correct';  // ✅ Tell RiddleModal what to show
            } else {
                return 'incorrect';
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data.message || 'Incorrect answer.');
                setLastAttemptStatus('incorrect');
                return 'incorrect';
            } else {
                setError(err.response?.data?.message || 'Unexpected error.');
                setLastAttemptStatus('error');
                return 'error';
            }
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFolder(null);
        setCurrentRiddle(null);
        setError('');
        setMessage('');
        setLastAttemptStatus(null);
        setShowFinalSuccess(false);
    };

    if (loading) return <div className="game-container">Loading game...</div>;

    return (
        <div className="game-page">
            <h1>Unlock the Secrets!</h1>

            {lastAttemptStatus === 'folderUnlocked' && (
                <div className="popup-overlay">
                    <div className="popup-success">🎉 Folder Unlocked!</div>
                </div>
            )}

            {error && !isModalOpen && <p className="error-message">{error}</p>}
            {message && !isModalOpen && message !== 'FOLDER_UNLOCKED' && (
                <p className="success-message">{message}</p>
            )}

            <FolderGrid
                folders={folders}
                unlockedFolders={unlockedFolderIds}
                onFolderClick={handleFolderClick}
                isFolderAccessible={isFolderAccessible}
            />

            {isModalOpen && currentRiddle && (
                <RiddleModal
                    riddle={currentRiddle}
                    onClose={closeModal}
                    onSubmitAnswer={(answer) => handleAnswerSubmit(selectedFolder, answer)}
                    folderId={selectedFolder}
                    lastAttemptStatus={lastAttemptStatus}
                    showFinalSuccess={showFinalSuccess}
                />
            )}
        </div>
    );
}

export default GamePage;
