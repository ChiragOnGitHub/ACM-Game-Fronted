// client/src/components/Common/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Your custom auth hook

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // You might want a better loading indicator here
        return <div>Loading authentication...</div>;
    }

    // If authenticated, render the children (the protected component)
    // Otherwise, redirect to the login page
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;