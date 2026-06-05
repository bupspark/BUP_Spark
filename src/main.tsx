import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign Vite WebSocket/HMR disconnect errors caused by platform HMR control state
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    (event.reason.message?.includes('WebSocket') ||
     event.reason.message?.includes('vite') ||
     String(event.reason).includes('WebSocket') ||
     String(event.reason).includes('vite'))
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (
    event.message &&
    (event.message.includes('WebSocket') ||
     event.message.includes('vite') ||
     event.message.includes('websocket'))
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
