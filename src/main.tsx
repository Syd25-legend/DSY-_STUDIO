// src/main.tsx

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SpeedInsights } from '@vercel/speed-insights/react';
import React from 'react';

// Providers
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // <-- IMPORTED
import { AuthProvider } from './hooks/useAuth'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-D03S1PLQKY"; 
ReactGA.initialize(GA_MEASUREMENT_ID);
// Initialize the Query Client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider> {/* <-- WRAPPER START */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <SpeedInsights />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider> {/* <-- WRAPPER END */}
  </React.StrictMode>
);