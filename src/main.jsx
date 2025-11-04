import React from 'react';
import ReactDOM from 'react-dom/client';
import PortfolioTuanVN from './PortfolioTuanVN.jsx';
import './index.css';

import { initTracking } from "./tracking.js";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PortfolioTuanVN />
  </React.StrictMode>
);

// --- Visitor tracking to Google Sheets ---
// TODO: Replace with your Apps Script Web App URL
initTracking(import.meta?.env?.VITE_GS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbzkVg6x347o1BHqIG5Jqtsv-wxJmGgulMlHcoInlLg2OvKnZuNF9BRU5KotaAsNZKw/exec");
