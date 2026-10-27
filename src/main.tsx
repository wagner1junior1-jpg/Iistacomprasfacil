import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/plus-jakarta-sans/latin-300.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import './index.css';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StorageService } from './services/storage';

// Service Worker só na versão web (PWA). No app Android os arquivos já ficam dentro do APK,
// e um Service Worker serviria JS antigo do cache depois de uma atualização da loja.
if ('serviceWorker' in navigator) {
  if (Capacitor.isNativePlatform()) {
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister())).catch(() => {});
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('MercadoFácil: Falha ao registrar Service Worker:', err);
      });
    });
  }
}

// Botão Voltar do Android: fecha o modal aberto; sem modal, sai do app
if (Capacitor.isNativePlatform()) {
  CapacitorApp.addListener('backButton', () => {
    if (document.querySelector('[role="dialog"]')) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      CapacitorApp.exitApp();
    }
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

