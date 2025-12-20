import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Enhanced global error handling for ESM deployment debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Critical System Error:", message, "\nSource:", source, "\nLine:", lineno);
  
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: 'Inter', sans-serif; text-align: center; color: #ef4444; max-width: 600px; margin: 100px auto; background: #fff; border-radius: 24px; shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h2 style="font-weight: 900; color: #1e293b; margin-bottom: 10px;">Initialization Failed</h2>
        <p style="color: #64748b; margin-bottom: 24px; line-height: 1.6;">The application encountered a runtime error during startup. This is often due to missing environment variables or CDN connectivity issues.</p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 12px; text-align: left; margin-bottom: 24px; overflow-x: auto; color: #475569;">
          ${message}
        </div>
        <button onclick="window.location.reload(true)" style="background: #f43f5e; color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 800; transition: transform 0.2s;">
          RETRY CONNECTION
        </button>
      </div>
    `;
  }
};

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    // Trigger window.onerror manually if React fails to mount
    if (window.onerror) {
      window.onerror(err instanceof Error ? err.message : String(err), "index.tsx", 0, 0, err);
    }
  }
};

// Start the app
mountApp();