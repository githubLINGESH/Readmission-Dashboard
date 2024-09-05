import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "bootstrap/dist/css/bootstrap.css";
import "../src/assets/css/paper-dashboard.css?v=1.3.0";
import "../src/assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { ClerkProvider } from '@clerk/clerk-react';

// Import your publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
