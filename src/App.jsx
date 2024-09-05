import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './layouts/Admin';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <Routes>
            <Route path="/admin/*" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/admin/readmission-dashboard" replace />} />
          </Routes>
        </div>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
