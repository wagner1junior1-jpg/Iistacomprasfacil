import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useModalA11y } from '../utils/useModalA11y';
import { useShopping } from '../context/ShoppingContext';
import {
  Menu,
  ChevronDown,
  Plus,
  MoreVertical,
  ShoppingCart,
  GitCompare,
  TrendingUp,
  FolderTree,
  Store,
  FileSpreadsheet,
  CheckCheck,
  RotateCcw,
  Sun,
  Moon,
  X,
  ListPlus,
  Trash2,
  CheckSquare,
  Square,
  Share2,
  Sparkles,
  Scale,
  Wifi,
  WifiOff,
  Smartphone,
} from 'lucide-react';
import { calculateListTotals, formatCurrency } from '../utils/helpers';

interface HeaderProps {
  onOpenAddItem: () => void;
  onOpenExport: () => void;
  onOpenCalculator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddItem, onOpenExport, onOpenCalculator }) => {
  const {
    lists,
    activeListId,
    setActiveListId,
    addList,
    deleteList,
    items,
    activeTab,
    setActiveTab,
    settings,
    toggleTheme,
    markAllBought,
    unmarkAllBought,
    clearBoughtItems,
    resetToFreshStart,
    hasUsedInitialReset,
  } = useShopping();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const newListDialogRef = useModalA11y(isNewListModalOpen, () => setIsNewListModalOpen(false));
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Active list calculation
  const currentList = lists.find(l => l.id === activeListId) || lists[0] || { id: 'list-default', name: 'Minha lista' };
  const currentListItems = items.filter(i => !i.listId || i.listId === activeListId);
  const totals = calculateListTotals(currentListItems);

  const isDark = settings.theme === 'dark';

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    addList(newListName.trim());
    setNewListName('');
    setIsNewListModalOpen(false);
    setIsListDropdownOpen(false);
  };

  return (
    <>
      {/* Top Header Bar - Exact style of screenshots */}
      <header className="sticky top-0 z-40 bg-[#2F7D4E] text-white shadow-md select-none pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 h-14 flex items-center justify-between">
          
          {/* Left: Hamburger Menu & Title */}
          <div className="flex items-center gap-2">
            <button
              id="header-drawer-btn"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-white/10 active:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Abrir Menu Principal"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            {/* "Minha lista ▼" Dropdown Trigger */}
            <div className="relative">
              <button
                id="header-list-switcher-btn"
                onClick={() => {
                  setIsListDropdownOpen(!isListDropdownOpen);
                  setIsMenuDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-left"
              >
                <h1 className="text-sm sm:text-base font-medium text-white tracking-wide truncate max-w-[105px] xs:max-w-[160px] sm:max-w-[220px]">
                  {currentList.name}
                </h1>
                <ChevronDown className="w-4 h-4 text-white/90 shrink-0" />
              </button>

              {/* List Switcher Dropdown */}
              {isListDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50 bg-black/20"
                    onClick={() => setIsListDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-white">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Suas Listas de Compras
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {lists.map(list => {
                        const count = items.filter(i => (!i.listId && list.id === 'list-default') || i.listId === list.id).length;
                        const isSelected = list.id === activeListId;
                        return (
                          <div
                            key={list.id}
                            className={`flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                              isSelected ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold' : ''
                            }`}
                            onClick={() => {
                              setActiveListId(list.id);
                              setIsListDropdownOpen(false);
                            }}
                          >
                            <span className="truncate">{list.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                                {count}
                              </span>
                              {lists.length > 1 && !list.isDefault && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Deseja excluir a lista "${list.name}"?`)) {
                                      deleteList(list.id);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-500 p-1"
                                  title="Excluir lista"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsNewListModalOpen(true);
                          setIsListDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Criar Nova Lista</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Red Reset Button - Zerar Lista & Mercados (Desaparece após 1 clique) */}
            {!hasUsedInitialReset && (
              <button
                id="header-reset-fresh-btn"
                type="button"
                onClick={() => {
                  const confirmed = window.confirm(
                    'Deseja realmente ZERAR a lista de compras e reiniciar os mercados?\n\n' +
                    '• Todos os produtos da lista serão apagados.\n' +
                    '• Ficará cadastrado apenas o "Mercado 1" (que você poderá renomear quando quiser).\n\n' +
                    'Essa ação permite que você comece do zero com seus próprios itens e mercados.'
                  );
                  if (confirmed) {
                    resetToFreshStart();
                    alert('Lista de compras zerada com sucesso!\nFicou apenas o "Mercado 1" para você personalizar.');
                  }
                }}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer shrink-0 border border-red-500/40 animate-in fade-in zoom-in-95 duration-200"
                title="Zerar lista e deixar apenas o Mercado 1 para começar do zero"
                aria-label="Zerar lista"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden xs:inline">Zerar Lista</span>
                <span className="xs:hidden">Zerar</span>
              </button>
            )}
          </div>

          {/* Right: Status Offline, Calculator, Quick Add Icon & 3-Dots Menu */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {!isOnline && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-bold border border-amber-400/30 animate-pulse">
                <WifiOff className="w-3 h-3 text-amber-300" />
                <span>Offline</span>
              </span>
            )}

            {onOpenCalculator && (
              <button
                onClick={onOpenCalculator}
                className="p-2 hover:bg-white/10 active:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Tira-Teima de Preço por Peso / Litro"
                aria-label="Calculadora de Peso"
              >
                <Scale className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Direct Theme Toggle Button (Light / Dark) */}
            <button
              id="header-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 active:bg-white/20 rounded-full transition-colors cursor-pointer"
              title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              aria-label="Alternar tema claro e escuro"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-white" />}
            </button>

            {/* Quick Add Product Button */}
            <button
              id="header-quick-add-btn"
              onClick={onOpenAddItem}
              className="p-2 hover:bg-white/10 active:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Adicionar item à lista"
              aria-label="Adicionar item"
            >
              <ListPlus className="w-5 h-5 text-white" />
            </button>

            {/* 3-Dots Menu */}
            <div className="relative">
              <button
                id="header-more-menu-btn"
                onClick={() => {
                  setIsMenuDropdownOpen(!isMenuDropdownOpen);
                  setIsListDropdownOpen(false);
                }}
                className="p-2 hover:bg-white/10 active:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Mais opções"
                aria-label="Mais opções"
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </button>

              {/* 3-Dots Dropdown */}
              {isMenuDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50 bg-black/10"
                    onClick={() => setIsMenuDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 py-1.5 text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 text-sm">
                    {onOpenCalculator && (
                      <button
                        onClick={() => {
                          onOpenCalculator();
                          setIsMenuDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <Scale className="w-4 h-4 text-emerald-600" />
                        <span>Tira-Teima de Preço (g/kg)</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        markAllBought();
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <span>Marcar todos como comprados</span>
                    </button>
                    <button
                      onClick={() => {
                        unmarkAllBought();
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>Desmarcar todos</span>
                    </button>
                    <button
                      onClick={() => {
                        clearBoughtItems();
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Limpar itens do carrinho</span>
                    </button>
                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={() => {
                        onOpenExport();
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Exportar Planilha CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('comparator');
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <GitCompare className="w-4 h-4 text-blue-500" />
                      <span>Comparar Preços</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setIsMenuDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                      <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Side Navigation Drawer (Classic Android / Material App Drawer) */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
            
            {/* Drawer Header with Green Banner */}
            <div className="bg-[#2F7D4E] text-white p-5 pt-7">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-lg font-bold mt-3 text-white">MercadoFácil</h2>
              <p className="text-xs text-emerald-100 mt-0.5">Minhas compras & comparador</p>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1 px-2 text-slate-700 dark:text-slate-200 text-sm">
              <button
                onClick={() => {
                  setActiveTab('list');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'list'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                <span>Lista de Compras</span>
                {totals.pendingCount > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold font-mono">
                    {totals.pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('comparator');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'comparator'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <GitCompare className="w-5 h-5 text-blue-500" />
                <span>Comparar Preços</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span>Gastos & Histórico Mensal</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('categories');
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FolderTree className="w-5 h-5 text-amber-500" />
                <span>Categorias & Mercados</span>
              </button>

              <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  onOpenExport();
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-5 h-5 text-teal-600" />
                <span>Exportar Planilha Excel</span>
              </button>

              {/* Install PWA Button (não faz sentido dentro do app da Play Store) */}
              {!Capacitor.isNativePlatform() && (
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  window.dispatchEvent(new CustomEvent('open-pwa-install'));
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800/60"
              >
                <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold">Instalar App no Celular</span>
              </button>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>100% Offline • Local</span>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 cursor-pointer"
                title="Mudar tema"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </>
      )}

      {/* Create New List Modal */}
      {isNewListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div ref={newListDialogRef} role="dialog" aria-modal="true" aria-label="Criar nova lista" className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Criar Nova Lista de Compras
            </h3>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Ex: Feira de Domingo, Churrasco, Farmácia..."
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewListModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Criar Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
