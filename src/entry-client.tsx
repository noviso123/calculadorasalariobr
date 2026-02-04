
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error("Root element not found");

// Check if we have pre-rendered content (Server Side Generated)
// If root has children, it means we are hydrating static HTML
const hasStaticContent = container.hasChildNodes();

if (hasStaticContent) {
    ReactDOM.hydrateRoot(
        container,
        <React.StrictMode>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </React.StrictMode>
    );
} else {
    // Fallback for dev mode or if HTML is empty
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <HelmetProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </HelmetProvider>
        </React.StrictMode>
    );
}
