import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/router.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {
  isSessionValid,
  setupSessionTimeout,
  clearAuth,
} from './utils/sessionManager';

/**
 * App wrapper to handle session timeout globally
 */
function App() {
  useEffect(() => {
    // If session already expired, clean up immediately
    if (!isSessionValid()) {
      clearAuth();
      return;
    }

    // Setup timeout based on cookie expiration
    setupSessionTimeout(() => {
      clearAuth();
      window.location.href = '/login';
    });
  }, []);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
