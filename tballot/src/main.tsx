// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// Suppress wallet extension errors globally
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const errorMsg = args.join(' ');
  // Suppress "Unexpected error" from wallet extensions (evmAsk.js, page.js)
  if (errorMsg.includes('Unexpected error') || 
      errorMsg.includes('not been authorized') ||
      errorMsg.includes('evmAsk.js') ||
      (errorMsg.includes('page.js') && errorMsg.includes('not been authorized'))) {
    return; // Don't log these errors
  }
  originalConsoleError.apply(console, args);
};

// Suppress unhandled promise rejections from wallet extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMsg = event.reason?.message || event.reason?.toString() || '';
  if (errorMsg.includes('Unexpected error') || 
      errorMsg.includes('not been authorized') ||
      errorMsg.includes('evmAsk') ||
      (typeof event.reason === 'string' && event.reason.includes('not been authorized'))) {
    event.preventDefault(); // Prevent error from being logged
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)