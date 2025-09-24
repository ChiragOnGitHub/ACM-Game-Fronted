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
    const [loadingFolder, setLoadingFolder] = useState(false);
    const [submittingAnswer, setSubmittingAnswer] = useState(false);
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
            const unlockedIds = userGameState.unlockedFolders
            .filter(uf => uf.currentRiddleAttempt === null)
            .map(uf => uf.folderId._id);
            console.log(unlockedIds);
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
        if (loadingFolder) return;
        const folderToOpen = folders.find(f => f._id === folderId);
        if (!folderToOpen) {
            setError('Folder not found.');
            return;
        }

        const isAccessible = isFolderAccessible(folderToOpen);
        if (!isAccessible) {
            setError('This folder is locked!');
            return;
        }

        setLoadingFolder(true);
        setError('');
        setMessage('');
        setLastAttemptStatus(null);
        setSelectedFolder(folderId);

        try {
            const { riddle, isUnlocked } = await getFolderDetails(folderId);

            if (isUnlocked && !riddle) {
                setMessage('This folder has been fully completed!');
                setIsModalOpen(false);
                setSelectedFolder(null);
                setCurrentRiddle(null);
            } else if (riddle) {
                setCurrentRiddle(riddle);
                setIsModalOpen(true);
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
        setLoadingFolder(false);
    };

    const handleAnswerSubmit = async (folderId, answer) => {
        if (submittingAnswer) return;
        setSubmittingAnswer(true);
        setError('');
        setMessage('');
        setLastAttemptStatus(null);

        try {
            const result = await submitAnswer(folderId, answer);

            if (result.unlocked) {
                setUnlockedFolderIds(prev => [...prev, folderId]);
                setLastAttemptStatus('folderUnlocked');
                setShowFinalSuccess(true);

                // Show success feedback for longer before closing
                setTimeout(async () => {
                    closeModal();
                    await fetchInitialGameData();
                }, 2500);

                return 'folder-unlocked';
            } else if (result.nextRiddle) {
                setMessage(result.message || 'Correct! Next part...');
                setLastAttemptStatus('nested-correct');
                setCurrentRiddle(result.nextRiddle);
                return 'nested-correct';
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
        } finally {
            setSubmittingAnswer(false);
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

    // Enhanced loading screen with different messages based on loading state
    const getLoadingMessage = () => {
        if (loading) return { title: "🔐 Initializing Secrets", subtitle: "Preparing your puzzle adventure..." };
        if (loadingFolder) return { title: "🗂️ Accessing Folder", subtitle: "Decrypting hidden contents..." };
        if (submittingAnswer) return { title: "⚡ Verifying Answer", subtitle: "Checking your solution..." };
        return { title: "🔐 Loading", subtitle: "Please wait..." };
    };

    const loadingMessage = getLoadingMessage();

    return (
        <div className="game-page">
            {(loading || loadingFolder || submittingAnswer) && (
                <div className="overlay-loader">
                    <div className="loading-content">
                        <div className="loading-title">{loadingMessage.title}</div>
                        <div className="loading-subtitle">{loadingMessage.subtitle}</div>
                        
                        <div className="lock-container">
                            <div className="lock-icon">🔓</div>
                        </div>
                        
                        <div className="progress-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                </div>
            )}

            <h1>Unlock the Secrets!</h1>

            {lastAttemptStatus === 'folderUnlocked' && (
                <div className="popup-overlay">
                    <div className="popup-success">
                        <div className="success-icon">🎉</div>
                        <div className="success-title">Folder Unlocked!</div>
                        <div className="success-subtitle">Excellent work, detective!</div>
                    </div>
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
                    submittingAnswer={submittingAnswer}
                />
            )}
        </div>
    );
}

export default GamePage;