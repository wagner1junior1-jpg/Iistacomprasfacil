import React, { useState, useEffect } from 'react';
import { useModalA11y } from '../../utils/useModalA11y';
import { Download, X, Share, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const guideDialogRef = useModalA11y(showGuide, () => setShowGuide(false));

  useEffect(() => {
    // Verifica se já está rodando como app instalado (standalone)
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // Detecta iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // Mostra o banner de instalação após 1.5s se não foi dispensado recentemente
    const dismissedAt = localStorage.getItem('mercadofacil_install_dismissed');
    let shouldShow = true;
    if (dismissedAt) {
      const diffHours = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (diffHours < 24) {
        shouldShow = false;
      }
    }

    if (shouldShow) {
      const timer = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(timer);
    }

    // Evento customizado para abrir pelo menu
    const handleOpenManual = () => {
      setShowPrompt(true);
      if (!deferredPrompt) {
        setShowGuide(true);
      } else {
        deferredPrompt.prompt();
      }
    };
    window.addEventListener('open-pwa-install', handleOpenManual);

    // Android e Desktop Chromium: captura o evento nativo
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleOpenManual);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      } catch {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowGuide(false);
    localStorage.setItem('mercadofacil_install_dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <>
      {/* Banner discreto no topo */}
      <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2F7D4E] text-white px-3.5 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm animate-in slide-in-from-top duration-300 relative z-30">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div className="truncate">
            <p className="font-bold truncate">Instalar MercadoFácil no Celular</p>
            <p className="text-[11px] text-emerald-100 truncate">
              Funciona 100% offline dentro de qualquer supermercado
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-lg bg-white text-[#1B4D3E] font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-transform flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-white/80 hover:text-white rounded-lg cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Guia de Instalação (Android / iOS / PC) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div ref={guideDialogRef} role="dialog" aria-modal="true" aria-label="Guia de instalação" className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base">
                  {isIOS ? 'Instalar no iPhone / iPad' : 'Instalar no Celular'}
                </h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tenha o aplicativo direto na tela inicial para usar 100% offline em qualquer supermercado:
            </p>

            {isIOS ? (
              <ol className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span>
                    Toque no botão <b>Compartilhar</b> <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-500" /> na barra inferior do Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span>
                    Role as opções para baixo e selecione <b>Adicionar à Tela de Início</b>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span>
                    Toque em <b>Adicionar</b>. Pronto! O ícone estará na sua tela inicial.
                  </span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    1
                  </span>
                  <span>
                    Toque no menu de <b>3 pontinhos (⋮)</b> no canto superior direito do seu navegador (Chrome).
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    2
                  </span>
                  <span>
                    Selecione <b>Instalar aplicativo</b> (ou <b>Adicionar à tela inicial</b>).
                  </span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                    3
                  </span>
                  <span>
                    Confirme em <b>Instalar</b>. O app abrirá em tela cheia com ícone próprio!
                  </span>
                </li>
              </ol>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
