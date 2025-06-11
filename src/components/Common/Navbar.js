// client/src/components/Common/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css'; // Optional: for basic styling

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        // The useAuth hook's logout function should handle redirecting
        // or triggering a state update that causes a re-render.
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Folder Game</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/game">Game</Link></li>
                        {user?.isAdmin && ( // Only show Admin link if user is an admin
                            <li><Link to="/admin">Admin</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;