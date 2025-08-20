import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SpeedInsights } from '@vercel/speed-insights/react'; // Import the component
import React from 'react'; // Import React for StrictMode

// Correct Placement
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);
