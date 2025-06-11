// client/src/components/Common/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Your custom auth hook

function AdminRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        // You might want a better loading indicator here
        return <div>Loading authentication...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but not an admin, redirect to home or a forbidden page
    if (!user?.isAdmin) {
        // You can redirect to a /forbidden page, or just / to avoid exposing admin routes
        return <Navigate to="/" replace />;
    }

    // If authenticated and is an admin, render the children
    return children;
}

export default AdminRoute;