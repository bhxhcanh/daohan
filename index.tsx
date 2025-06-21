
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Tailwind base styles are included via CDN in index.html,
// but if you had a global css file, you'd import it here.
// import './index.css'; 

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
