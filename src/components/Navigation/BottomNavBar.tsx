import React, { useState } from 'react';
import { useModalA11y } from '../../utils/useModalA11y';
import { useShopping } from '../../context/ShoppingContext';
import { ShoppingCart, GitCompare, TrendingUp, FolderTree, Scale, Star, X } from 'lucide-react';

interface BottomNavBarProps {
  onOpenCalculator: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ onOpenCalculator }) => {
  const { activeTab, setActiveTab, items, activeListId } = useShopping();
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const creditsDialogRef = useModalA11y(isCreditsOpen, () => setIsCreditsOpen(false));

  const currentListItems = items.filter(i => !i.listId || i.listId === activeListId);
  const pendingCount = currentListItems.filter(i => !i.bought).length;

  return (
    <nav
      aria-label="Navegação Principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] select-none pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md mx-auto h-16 px-2 flex items-center justify-around">
        
        {/* 1. Lista de Compras */}
        <button
          onClick={() => setActiveTab('list')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'list'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 ${activeTab === 'list' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-xs">
                {pendingCount > 99 ? '99+' : pendingCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Lista</span>
          {activeTab === 'list' && (
            <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* 2. Comparador */}
        <button
          onClick={() => setActiveTab('comparator')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'comparator'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <GitCompare className={`w-5 h-5 ${activeTab === 'comparator' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Comparar</span>
          {activeTab === 'comparator' && (
            <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* 3. Tira-Teima Calculadora (Acesso Rápido Mobile) */}
        <button
          onClick={onOpenCalculator}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          title="Tira-Teima de Preço por Peso / Litro"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center -mt-2 shadow-xs border border-emerald-200 dark:border-emerald-800">
            <Scale className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Tira-Teima</span>
        </button>

        {/* 4. Gastos & Histórico */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Gastos</span>
          {activeTab === 'analytics' && (
            <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* 5. Mercados & Categorias */}
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <FolderTree className={`w-5 h-5 ${activeTab === 'categories' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Mercados</span>
          {activeTab === 'categories' && (
            <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* 6. Estrela Amarela - Desenvolvedor */}
        <button
          type="button"
          onClick={() => setIsCreditsOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-90 cursor-pointer group"
          title="Desenvolvido por Wagner Torres"
          aria-label="Desenvolvido por Wagner Torres"
        >
          <Star className="w-5 h-5 fill-amber-400 text-amber-500 drop-shadow-xs group-hover:scale-110 transition-transform" />
          <span className="text-[10px] mt-1 tracking-tight text-amber-600 dark:text-amber-400 font-bold">Autor</span>
        </button>

      </div>

      {/* Developer Credits Modal / Card */}
      {isCreditsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsCreditsOpen(false)}
        >
          <div
            ref={creditsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Créditos"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center relative animate-in zoom-in-95 duration-200 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsCreditsOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Star Badge */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shadow-md">
              <Star className="w-9 h-9 fill-amber-400 text-amber-500 drop-shadow-sm" />
            </div>

            {/* Label */}
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Créditos
            </span>

            {/* Title & Wagner Torres */}
            <h3 className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Desenvolvido por
            </h3>
            <p className="text-xl font-extrabold text-[#2F7D4E] dark:text-emerald-400 mt-0.5 mb-3 tracking-wide">
              Wagner Torres
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
              Sistema de Compras Mensais, Catálogo Inteligente e Comparador de Supermercados.
            </p>

            {/* Close Action */}
            <button
              type="button"
              onClick={() => setIsCreditsOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2F7D4E] hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
