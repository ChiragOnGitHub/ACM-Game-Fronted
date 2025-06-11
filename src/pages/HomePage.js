// client/src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // To check login status
import './HomePage.css'; // You can create this file for styling

function HomePage() {
    const { user, isAuthenticated } = useAuth(); // Get user and isAuthenticated from your auth hook

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Welcome to the Folder Game!</h1>
                <p className="tagline">Unravel the mysteries, unlock the folders, and become the ultimate puzzle solver.</p>
            </header>

            <section className="home-cta">
                {!isAuthenticated ? (
                    <>
                        <h2>Ready to play?</h2>
                        <div className="home-buttons">
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Welcome back, {user?.username || 'Player'}!</h2>
                        <div className="home-buttons">
                            <Link to="/game" className="btn btn-primary">Start Game</Link>
                            {user?.isAdmin && ( // Only show admin link if user is an admin
                                <Link to="/admin" className="btn btn-tertiary">Admin Panel</Link>
                            )}
                        </div>
                    </>
                )}
            </section>

            <section className="home-info">
                <h2>How to Play</h2>
                <p>
                    Navigate through a series of locked folders, each containing a unique riddle.
                    Solve the riddles to unlock new folders and progress through the game.
                    Some folders might depend on others, so choose your path wisely!
                </p>
                <p>
                    Compete with other players on the leaderboard and see who can unlock all the secrets first!
                </p>
            </section>
        </div>
    );
}

export default HomePage;