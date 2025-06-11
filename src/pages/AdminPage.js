// client/src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AdminLogin from '../components/Admin/AdminLogin';
import { useAuth } from '../hooks/useAuth';

function AdminPage() {
    const { user, loading } = useAuth();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    useEffect(() => {
        if (!loading && user && user.isAdmin) {
            setIsAdminLoggedIn(true);
        } else if (!loading && !user?.isAdmin) {
            setIsAdminLoggedIn(false); // Ensure it's false if user is not admin
        }
    }, [user, loading]);

    if (loading) {
        return <div className="admin-page">Loading admin panel...</div>;
    }

    if (!isAdminLoggedIn) {
        return <AdminLogin onAdminLogin={() => setIsAdminLoggedIn(true)} />;
    }

    return (
        <div className="admin-page">
            <AdminDashboard />
        </div>
    );
}

export default AdminPage;