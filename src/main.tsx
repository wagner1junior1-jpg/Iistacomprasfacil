import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StorageService } from './services/storage';

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

// Recupera dados do IndexedDB (se o localStorage foi limpo) antes do primeiro render,
// com limite de tempo para nunca travar a abertura do app.
const restored = Promise.race([
  StorageService.restoreFromIdb(),
  new Promise<void>(resolve => setTimeout(resolve, 2000)),
]).catch(() => {});

restored.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

