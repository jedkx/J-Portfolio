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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
