import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Dashboard from './pages/dashboard_new';
import { DarkModeProvider } from './context/DarkModeContext';

createRoot(document.getElementById('root')).render(
    <DarkModeProvider>
    <Dashboard />
    </DarkModeProvider>,
);
