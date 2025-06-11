// client/src/components/Game/FolderGrid.js
import React from 'react';
import './FolderGrid.css'; // The missing CSS file

function FolderGrid({ folders, unlockedFolders, onFolderClick, isFolderAccessible }) { // Receive isFolderAccessible
    return (
        <div className="folder-grid">
            {folders.map(folder => {
                const isUnlocked = unlockedFolders.includes(folder._id);
                const accessible = isFolderAccessible(folder); // Use the prop from GamePage
                const isClickable = accessible && !isUnlocked;


                let folderClass = 'folder-item';
                if (isUnlocked) {
                    folderClass += ' unlocked'; // Folder is fully completed
                } else if (accessible) {
                    folderClass += ' active-puzzle'; // Folder is ready to be solved
                } else {
                    folderClass += ' locked'; // Folder has unmet dependencies
                }

                return (
                    <div
                        key={folder._id}
                        // Only allow click if accessible (which includes already unlocked folders)
                        className={`${folderClass} ${isClickable ? 'clickable' : 'unclickable'}`}
                        onClick={isClickable ? () => onFolderClick(folder._id) : null}
                    >
                        <div className="folder-icon">
                            {isUnlocked ? '✅' : accessible ? '❓' : '🔒'} {/* More descriptive icons */}
                        </div>
                        <h3>{folder.name}</h3>
                        {!isUnlocked && !accessible && ( // Show dependencies only if not unlocked and not accessible
                            <p className="folder-dependency-info">
                                Requires: {folder.dependencies.map(depId => {
                                    const depFolder = folders.find(f => f._id === depId);
                                    return depFolder ? depFolder.name : depId;
                                }).join(', ')}
                            </p>
                        )}
                        {isUnlocked && <p className="folder-status">UNLOCKED!</p>}
                        {accessible && !isUnlocked && <p className="folder-status">Solve Me!</p>}
                    </div>
                );
            })}
        </div>
    );
}

export default FolderGrid;