import React, { useState, useMemo } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { ShoppingItem } from '../../types';
import { ItemCard } from './ItemCard';
import { FinishShoppingModal } from './FinishShoppingModal';
import { calculateListTotals, formatCurrency } from '../../utils/helpers';
import {
  Plus,
  Search,
  ShoppingCart,
  Calculator,
  Trash2,
  CheckCheck,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export const ShoppingListView: React.FC = () => {
  const {
    items,
    activeListId,
    categories,
    supermarkets,
    trips,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    addItem,
    updateItem,
    deleteItem,
    toggleItemBought,
    clearBoughtItems,
    clearAllItems,
    finishShoppingTrip,
    setActiveTab,
    setIsCatalogModalOpen,
    openItemModal,
  } = useShopping();

  // Modals state
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [isMarketMode, setIsMarketMode] = useState(false);



  // Mapeamento do último preço pago para cada produto a partir de compras finalizadas
  const lastPricesMap = useMemo(() => {
    const map = new Map<string, { price: number; supermarketName?: string; date?: string }>();
    const sortedTrips = [...trips].sort((a, b) => (b.date > a.date ? 1 : -1));
    sortedTrips.forEach(trip => {
      trip.items.forEach(tripItem => {
        const key = tripItem.name.trim().toLowerCase();
        const p = tripItem.actualPrice ?? tripItem.estimatedPrice;
        if (p && p > 0 && !map.has(key)) {
          map.set(key, {
            price: p,
            supermarketName: trip.supermarketName,
            date: new Date(trip.date + 'T12:00:00').toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
          });
        }
      });
    });
    return map;
  }, [trips]);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const newQty = Math.max(0.5, Math.round((target.quantity + delta) * 10) / 10);
    updateItem(id, { quantity: newQty });
  };

  // Filter items by active list
  const currentListItems = useMemo(() => {
    return items.filter(item => !item.listId || item.listId === activeListId);
  }, [items, activeListId]);

  // Filter items by search / category
  const filteredItems = useMemo(() => {
    return currentListItems.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchName && !matchNotes) return false;
      }
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }
      return true;
    });
  }, [currentListItems, searchQuery, selectedCategoryId]);

  // Separate pending items and items in cart
  const pendingItems = useMemo(() => filteredItems.filter(i => !i.bought), [filteredItems]);
  const cartItems = useMemo(() => filteredItems.filter(i => i.bought), [filteredItems]);

  // Group pending items by category
  const groupedPending = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();
    categories.forEach(c => map.set(c.id, []));
    map.set('cat-outros', []);

    pendingItems.forEach(item => {
      const catId = item.categoryId;
      if (map.has(catId)) {
        map.get(catId)!.push(item);
      } else {
        if (!map.has('cat-outros')) map.set('cat-outros', []);
        map.get('cat-outros')!.push(item);
      }
    });

    return Array.from(map.entries())
      .filter(([_, list]) => list.length > 0)
      .map(([catId, list]) => {
        const catObj = categories.find(c => c.id === catId);
        return {
          category: catObj || {
            id: catId,
            name: 'Outros',
            color: '#64748b',
            iconName: 'ShoppingBag',
          },
          items: list,
        };
      });
  }, [pendingItems, categories]);

  const totals = calculateListTotals(currentListItems);

  const handleOpenEdit = (item: ShoppingItem) => {
    openItemModal(item);
  };

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between relative bg-[#FAFAFA] dark:bg-slate-950 pb-36">
      
      <div className="w-full max-w-2xl mx-auto flex-1">
        
        {/* Search & Quick Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar produtos na lista..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Catalog Add Button */}
            <button
              onClick={() => setIsCatalogModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#2F7D4E] hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
              title="Adicionar itens à lista pelo catálogo"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline font-bold">Adicionar</span>
            </button>

            {/* View Mode Toggle */}
            <button
              onClick={() => setGroupByCategory(!groupByCategory)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                groupByCategory
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title="Agrupar por categorias"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Todos ({currentListItems.length})
            </button>
            {categories.map(cat => {
              const count = currentListItems.filter(i => i.categoryId === cat.id).length;
              if (count === 0 && selectedCategoryId !== cat.id) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                    selectedCategoryId === cat.id
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="text-[10px] opacity-75 font-mono">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Barra de Progresso Visual do Carrinho */}
          {currentListItems.length > 0 && (
            <div className="pt-2 pb-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                <span>No carrinho: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{totals.boughtCount} de {totals.totalCount} itens</strong></span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {totals.totalCount > 0 ? Math.round((totals.boughtCount / totals.totalCount) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300"
                  style={{ width: `${totals.totalCount > 0 ? (totals.boughtCount / totals.totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {currentListItems.length === 0 ? (
          <div className="p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Sua lista está vazia
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                Toque no botão azul <b>+</b> abaixo ou adicione itens sugeridos rapidamente:
              </p>
            </div>

            {/* Action button */}
            <div className="pt-3 max-w-xs mx-auto">
              <button
                onClick={() => setIsCatalogModalOpen(true)}
                className="w-full px-5 py-3 rounded-xl bg-[#2F7D4E] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Adicionar Itens do Catálogo</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm mx-auto pt-2">
              {['Arroz 5kg', 'Feijão', 'Leite Integral', 'Café', 'Banana', 'Sabão em Pó', 'Azeite', 'Pão'].map(sug => (
                <button
                  key={sug}
                  onClick={() => {
                    addItem({
                      name: sug,
                      categoryId: 'cat-mercearia',
                      quantity: 1,
                      unit: 'un',
                      bought: false,
                    });
                  }}
                  className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 font-medium transition-colors shadow-2xs cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            
            {/* 1. Pending Items Section */}
            {pendingItems.length > 0 && (
              <div>
                {groupByCategory ? (
                  // Grouped by category with gray header banner (Screenshot 1 style)
                  groupedPending.map(({ category, items: catItems }) => {
                    const isCollapsed = collapsedCategories[category.id] || false;
                    return (
                      <div key={category.id} className="border-b border-slate-100 dark:border-slate-800">
                        {/* Gray Category Header Banner */}
                        <button
                          onClick={() => toggleCategoryCollapse(category.id)}
                          className="w-full flex items-center justify-between px-4 py-2 bg-[#ECEEF1] dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider select-none cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{category.name}</span>
                            <span className="text-[11px] font-normal text-slate-500">
                              ({catItems.length})
                            </span>
                          </div>
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Category Items */}
                        {!isCollapsed && (
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {catItems.map(item => (
                              <ItemCard
                                key={item.id}
                                item={item}
                                category={category}
                                supermarkets={supermarkets}
                                lastPurchasedPrice={lastPricesMap.get(item.name.trim().toLowerCase())}
                                onToggleBought={toggleItemBought}
                                onEdit={handleOpenEdit}
                                onDelete={deleteItem}
                                onUpdateQuantity={handleUpdateQuantity}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Flat Pending Items List
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingItems.map(item => {
                      const cat = categories.find(c => c.id === item.categoryId);
                      return (
                        <ItemCard
                          key={item.id}
                          item={item}
                          category={cat}
                          supermarkets={supermarkets}
                          lastPurchasedPrice={lastPricesMap.get(item.name.trim().toLowerCase())}
                          onToggleBought={toggleItemBought}
                          onEdit={handleOpenEdit}
                          onDelete={deleteItem}
                          onUpdateQuantity={handleUpdateQuantity}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. "Carrinho" Section (Distinctive pastel green banner matching Screenshot 1 & 3) */}
            {cartItems.length > 0 && (
              <div className="mt-2 border-t-2 border-emerald-100 dark:border-emerald-950">
                {/* Carrinho Banner */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#C8E6C9] dark:bg-emerald-950 text-[#1B4D3E] dark:text-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Carrinho</span>
                    <span className="text-xs font-mono font-medium">({cartItems.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">
                      {formatCurrency(totals.totalBought)}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remover os ${cartItems.length} itens do carrinho? Essa ação não pode ser desfeita.`)) {
                          clearBoughtItems();
                        }
                      }}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline p-2 cursor-pointer"
                      title="Remover itens comprados"
                      aria-label="Remover itens comprados do carrinho"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items inside Carrinho */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/60 dark:bg-slate-900/60">
                  {cartItems.map(item => {
                    const cat = categories.find(c => c.id === item.categoryId);
                    return (
                      <ItemCard
                        key={item.id}
                        item={item}
                        category={cat}
                        supermarkets={supermarkets}
                        lastPurchasedPrice={lastPricesMap.get(item.name.trim().toLowerCase())}
                        onToggleBought={toggleItemBought}
                        onEdit={handleOpenEdit}
                        onDelete={deleteItem}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Floating Action Button (FAB) - O ÚNICO botão de adicionar itens à lista */}
      <button
        id="fab-add-item"
        onClick={() => setIsCatalogModalOpen(true)}
        className="fixed right-5 bottom-32 z-30 w-14 h-14 rounded-full bg-[#2F7D4E] hover:bg-emerald-700 active:scale-95 text-white shadow-2xl flex items-center justify-center transition-all cursor-pointer hover:shadow-emerald-600/40"
        title="Adicionar produtos pelo catálogo"
        aria-label="Adicionar produtos"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      {/* Bottom Sticky Status Bar - Positioned above BottomNavBar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#B8DAC0] dark:bg-[#1A3F2C] border-t border-[#9FC8A8] dark:border-emerald-800 select-none shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between text-slate-800 dark:text-emerald-50">
          
          {/* Left: Total */}
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-emerald-900 dark:text-emerald-300 shrink-0" />
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-emerald-900/80 dark:text-emerald-300/80">
                Total ({totals.totalCount})
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-950 dark:text-white">
                {formatCurrency(totals.totalEstimated > 0 ? totals.totalEstimated : totals.totalBought)}
              </div>
            </div>
          </div>

          {/* Right: Carrinho (Clickable to finish shopping trip) */}
          <button
            id="footer-carrinho-finish-btn"
            onClick={() => {
              if (cartItems.length > 0) {
                setIsFinishModalOpen(true);
              }
            }}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              cartItems.length > 0
                ? 'hover:bg-emerald-900/10 active:bg-emerald-900/20'
                : 'opacity-80'
            }`}
            title={cartItems.length > 0 ? 'Clique para finalizar a compra' : 'Carrinho de compras'}
          >
            <ShoppingCart className="w-5 h-5 text-emerald-900 dark:text-emerald-300 shrink-0" />
            <div className="text-right leading-tight">
              <div className="text-[11px] font-medium text-emerald-900/80 dark:text-emerald-300/80">
                Carrinho ({totals.boughtCount})
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-950 dark:text-white">
                {formatCurrency(totals.totalBought)}
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Finish Shopping Modal */}
      <FinishShoppingModal
        isOpen={isFinishModalOpen}
        boughtItems={cartItems}
        supermarkets={supermarkets}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={data => {
          finishShoppingTrip(data);
          setIsFinishModalOpen(false);
          setActiveTab('analytics');
        }}
      />

    </div>
  );
};
