import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import OTPVerification from './components/Auth/OTPVerification';
import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute'; // Custom for admin
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Common/Navbar';
import { Toaster } from 'react-hot-toast'; // Import Toaster - THIS IS THE FIX!
import Loading from './components/Common/Loading';
function App() {
    const { loading } = useAuth(); // Access auth state globally

    if (loading) {
        return <Loading />; // Or a proper spinner
    }

    return (
        <Router>
            <Navbar />
            <Toaster /> {/* Render Toaster here at a high level */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp/:email" element={<OTPVerification />} />

                {/* Protected Routes */}
                <Route
                    path="/game"
                    element={
                        <PrivateRoute>
                            <GamePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;