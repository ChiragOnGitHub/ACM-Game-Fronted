// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your global CSS
import App from './App';
import { AuthProvider } from './hooks/useAuth'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);