import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {initBotId} from 'botid/client/core';
import App from './App.tsx';
import './index.css';

// Vercel BotID: invisible bot protection for the shared request API. The
// challenge runs only in the production build — local dev is untouched.
// Real visitors solve it automatically; direct HTTP clients never do.
if (import.meta.env.PROD) {
  initBotId({
    protect: [{ path: '/api/requests', method: 'POST' }],
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
