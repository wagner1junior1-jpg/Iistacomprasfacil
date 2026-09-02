import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Registro do Service Worker para PWA e funcionamento 100% offline no celular
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('MercadoFácil: Service Worker registrado com sucesso:', reg.scope);
      })
      .catch((err) => {
        console.warn('MercadoFácil: Falha ao registrar Service Worker:', err);
      });
  });
} else if ('serviceWorker' in navigator) {
  // Também registra em preview local para testes offline
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

