// client/src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // Optional: for basic styling

function NotFoundPage() {
    return (
        <div className="not-found-page">
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="btn btn-primary">Go to Home</Link>
        </div>
    );
}

export default NotFoundPage;