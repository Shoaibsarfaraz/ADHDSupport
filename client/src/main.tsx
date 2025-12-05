import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// 1. IMPORT THE CONTEXT PROVIDERS
import { DataProvider } from './context/UserContext.js';
import { UserProfileProvider } from './context/UserProfileContext.js'; 

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* 2. NEST THE CONTEXT PROVIDERS */}
      <DataProvider>
        <UserProfileProvider>
          <App />
        </UserProfileProvider>
      </DataProvider>
    </ClerkProvider>
  </StrictMode>
);