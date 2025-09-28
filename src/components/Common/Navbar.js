// client/src/components/Common/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" onClick={closeMenu}>Folder Hunt</Link>
            </div>

            <button className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/game" onClick={closeMenu}>Game</Link></li>
                        {user?.isAdmin && (
                            <li><Link to="/admin" onClick={closeMenu}>Admin</Link></li>
                        )}
                        <li>
                            <button onClick={() => { handleLogout(); closeMenu(); }} className="navbar-logout-btn">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
                        <li><Link to="/signup" onClick={closeMenu}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
