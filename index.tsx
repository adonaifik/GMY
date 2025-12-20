import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handling for deployment debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Caught:", message, "at", source, ":", lineno);
  const root = document.getElementById('root');
  if (root && root.innerHTML.includes('Loading')) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; text-align: center; color: #ef4444;">
        <h2 style="font-weight: 900;">System Initialization Failed</h2>
        <p style="color: #64748b;">${message}</p>
        <button onclick="window.location.reload(true)" style="background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">Force Hard Refresh</button>
      </div>
    `;
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);