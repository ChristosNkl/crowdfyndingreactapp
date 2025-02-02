import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'; // Το κύριο αρχείο CSS για styling
import App from './components/App'; // Το κύριο component της εφαρμογής
import 'bootstrap/dist/css/bootstrap.min.css';


// Δημιουργία ρίζας και απόδοση της εφαρμογής
const root = ReactDOM.createRoot(document.getElementById('app-root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
