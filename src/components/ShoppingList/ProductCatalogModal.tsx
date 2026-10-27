import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Plus,
  Check,
  PackagePlus,
  Sparkles,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { PRODUCT_CATALOG, CatalogProduct } from '../../data/productCatalog';
import { Category, ShoppingItem } from '../../types';
import { getCategoryIcon } from '../../utils/icons';
import { formatCurrency } from '../../utils/helpers';
import { useModalA11y } from '../../utils/useModalA11y';

interface ProductCatalogModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onAddProducts: (items: Array<Omit<ShoppingItem, 'id' | 'createdAt'>>) => void;
  onOpenCustomCreate: (initialName: string) => void;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({
  isOpen,
  categories,
  onClose,
  onAddProducts,
  onOpenCustomCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const dialogRef = useModalA11y(isOpen, onClose);

  // Filter products by category and search term
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return PRODUCT_CATALOG.filter(prod => {
      const matchCat = selectedCategoryFilter === 'all' || prod.categoryId === selectedCategoryFilter;
      if (!matchCat) return false;

      if (!term) return true;
      const matchName = prod.name.toLowerCase().includes(term);
      const matchKw = prod.keywords.some(k => k.toLowerCase().includes(term));
      return matchName || matchKw;
    });
  }, [searchTerm, selectedCategoryFilter]);

  if (!isOpen) return null;

  const toggleSelectProduct = (product: CatalogProduct) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  };

  const handleConfirmBatchAdd = () => {
    if (selectedProductIds.size === 0) return;

    const itemsToAdd: Array<Omit<ShoppingItem, 'id' | 'createdAt'>> = [];
    selectedProductIds.forEach(id => {
      const prod = PRODUCT_CATALOG.find(p => p.id === id);
      if (prod) {
        itemsToAdd.push({
          name: prod.name,
          categoryId: prod.categoryId,
          quantity: 1,
          unit: prod.suggestedUnit,
          estimatedPrice: prod.averagePrice || null,
          actualPrice: null,
          bought: false,
          notes: undefined,
        });
      }
    });

    onAddProducts(itemsToAdd);
    setSelectedProductIds(new Set());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Catálogo de produtos" className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-500/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Catálogo de Mercado</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {PRODUCT_CATALOG.length} itens
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecione os produtos para adicionar rapidamente à sua lista
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Category Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40 shrink-0">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar no catálogo (ex: arroz, leite, sabão, carne, banana...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              Todos ({PRODUCT_CATALOG.length})
            </button>
            {categories.map(cat => {
              const count = PRODUCT_CATALOG.filter(p => p.categoryId === cat.id).length;
              if (count === 0) return null;
              const isSelected = selectedCategoryFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Product List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          
          {/* Create Custom Item Banner (Always accessible option for items not in the list) */}
          {searchTerm.trim() ? (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs text-slate-700 dark:text-slate-300 truncate">
                  <span>Não achou na lista? Cadastrar </span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-bold">"{searchTerm.trim()}"</strong>
                  <span> como novo item</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCustomCreate(searchTerm.trim());
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomCreate('');
              }}
              className="w-full p-2.5 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mb-2"
            >
              <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Não encontrou seu item? Cadastrar produto novo personalizado</span>
            </button>
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Nenhum produto correspondente no catálogo
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Você pode cadastrar esse item livremente com a quantidade e preço que desejar.
                </p>
              </div>
              {searchTerm.trim() && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCustomCreate(searchTerm.trim());
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar "{searchTerm.trim()}" na minha lista</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.has(product.id);
                const category = categories.find(c => c.id === product.categoryId);

                return (
                  <div
                    key={product.id}
                    onClick={() => toggleSelectProduct(product)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox circle */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {category && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-medium text-[10px]"
                              style={{ backgroundColor: `${category.color}15`, color: category.color }}
                            >
                              {getCategoryIcon(category.iconName, 'w-2.5 h-2.5')}
                              <span>{category.name.split(' ')[0]}</span>
                            </span>
                          )}
                          <span>•</span>
                          <span className="font-mono">Un: {product.suggestedUnit}</span>
                          {product.averagePrice && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-emerald-600 dark:text-teal-400 font-medium">
                                ~{formatCurrency(product.averagePrice)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectProduct(product);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {selectedProductIds.size === 0 ? (
              <span>Nenhum produto selecionado</span>
            ) : (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedProductIds.size} {selectedProductIds.size === 1 ? 'produto selecionado' : 'produtos selecionados'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmBatchAdd}
              disabled={selectedProductIds.size === 0}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar à Lista ({selectedProductIds.size})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
