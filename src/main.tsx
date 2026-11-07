// ============================================
// MAIN ENTRY POINT
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';
import './styles/editorial.css';
import './styles/quiet.css';
import './styles/navigation.css';
import './styles/refinement.css';
import './styles/contact-station.css';
import './styles/portfolio-chapters.css';
import './styles/react-bits-integration.css';
import './styles/signal-play.css';
import './styles/resilience.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
