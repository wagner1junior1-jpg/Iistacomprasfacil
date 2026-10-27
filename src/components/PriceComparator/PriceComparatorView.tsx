import React, { useState, useMemo } from 'react';
import { useModalA11y } from '../../utils/useModalA11y';
import { useShopping } from '../../context/ShoppingContext';
import { compareBasketAcrossMarkets, formatCurrency } from '../../utils/helpers';
import { getCategoryIcon } from '../../utils/icons';
import {
  GitCompare,
  TrendingDown,
  Store,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Tag,
  Edit3,
  DollarSign,
  ShoppingCart,
  Building2,
  Sparkles
} from 'lucide-react';

export const PriceComparatorView: React.FC = () => {
  const {
    items,
    categories,
    supermarkets,
    updateItemPriceForStore,
    setActiveTab,
  } = useShopping();

  const [searchProduct, setSearchProduct] = useState('');
  const [selectedSupermarketFilter, setSelectedSupermarketFilter] = useState<string>('all');
  
  // Modal for quick updating a price
  const [editingPriceData, setEditingPriceData] = useState<{
    itemId: string;
    itemName: string;
    supermarketId: string;
    currentPrice: number | string;
  } | null>(null);
  const priceDialogRef = useModalA11y(!!editingPriceData, () => setEditingPriceData(null));

  // Compare full basket across markets
  const basketComparison = useMemo(() => {
    return compareBasketAcrossMarkets(items, supermarkets);
  }, [items, supermarkets]);

  // Find cheapest store for whole basket
  const cheapestMarket = basketComparison.find(m => m.isCheapest);

  // All products list with comparison matrix
  const matrixProducts = useMemo(() => {
    return items.filter(item => {
      if (!searchProduct.trim()) return true;
      const q = searchProduct.toLowerCase();
      return item.name.toLowerCase().includes(q);
    });
  }, [items, searchProduct]);

  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceData) return;
    const priceNum = typeof editingPriceData.currentPrice === 'number'
      ? editingPriceData.currentPrice
      : parseFloat(String(editingPriceData.currentPrice).replace(',', '.'));

    if (isNaN(priceNum) || priceNum <= 0) return;

    const sm = supermarkets.find(s => s.id === editingPriceData.supermarketId);
    if (!sm) return;

    updateItemPriceForStore(
      editingPriceData.itemId,
      editingPriceData.supermarketId,
      sm.name,
      priceNum
    );

    setEditingPriceData(null);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <GitCompare className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Comparador de Preços entre Supermercados
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Compare o valor dos mesmos produtos entre redes de atacado e varejo para planejar onde economizar mais neste mês.
          </p>
        </div>

        {cheapestMarket && cheapestMarket.savingsVsHighest > 0 && (
          <div className="bg-emerald-50 dark:bg-[#0F172A] border border-emerald-200 dark:border-teal-500/30 p-3.5 rounded-xl shadow-md shrink-0">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-teal-400 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Economia Potencial na Lista
            </span>
            <div className="text-base sm:text-xl font-bold font-mono text-emerald-800 dark:text-teal-300 mt-1">
              Até {formatCurrency(cheapestMarket.savingsVsHighest)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Comprando no {cheapestMarket.supermarketName}
            </span>
          </div>
        )}
      </div>

      {/* 1. Basket Simulator across Supermarkets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
            <span>Simulador de Cesta: Onde sai mais barato?</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Baseado na sua lista de {items.length} itens
          </span>
        </div>

        {basketComparison.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Adicione produtos à sua lista para simular a cesta total.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {basketComparison.map(smResult => {
              const isBest = smResult.isCheapest && smResult.totalCost > 0;
              return (
                <div
                  key={smResult.supermarketId}
                  className={`relative p-4 rounded-2xl border transition-all ${
                    isBest
                      ? 'bg-emerald-50/40 dark:bg-[#1E293B] border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {isBest && (
                    <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md">
                      <TrendingDown className="w-3 h-3" />
                      MELHOR OPÇÃO
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#0F172A] border border-emerald-100 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-teal-400 font-bold text-xs">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {smResult.supermarketName}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {smResult.availableItemsCount} de {items.length} produtos precificados
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80 mb-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Custo Total da Cesta:</span>
                      <span className={`text-base font-mono font-bold ${isBest ? 'text-emerald-600 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                        {formatCurrency(smResult.totalCost)}
                      </span>
                    </div>

                    {smResult.savingsVsHighest > 0 && !isBest && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between font-mono">
                        <span>Diferença vs mais barato:</span>
                        <span className="text-red-500 dark:text-red-400 font-medium">
                          + {formatCurrency(smResult.totalCost - (cheapestMarket?.totalCost || 0))}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Coverage Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Cobertura de Preços</span>
                      <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{smResult.coveragePercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                      <div
                        className="h-full bg-emerald-600 dark:bg-teal-500 rounded-full"
                        style={{ width: `${smResult.coveragePercentage}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Side-by-side Matrix of Products */}
      <div className="space-y-3 pt-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
              <span>Tabela Comparativa de Produtos</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Clique em qualquer preço para atualizar conforme você encontra promoções
            </span>
          </div>

          {/* Search Product */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar produto..."
              value={searchProduct}
              onChange={e => setSearchProduct(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Produto & Categoria</th>
                  <th className="py-3 px-3 text-center">Qtd Lista</th>
                  {supermarkets.map(sm => (
                    <th key={sm.id} className="py-3 px-3 text-right whitespace-nowrap">
                      {sm.name}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right text-emerald-600 dark:text-teal-400">
                    Menor Preço
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {matrixProducts.length === 0 ? (
                  <tr>
                    <td colSpan={supermarkets.length + 3} className="py-8 text-center text-slate-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  matrixProducts.map(item => {
                    const cat = categories.find(c => c.id === item.categoryId);
                    const storePrices = item.storePrices || [];

                    // Calculate minimum price among registered
                    const validPrices = storePrices.filter(p => p.price > 0);
                    const minPrice = validPrices.length > 0
                      ? Math.min(...validPrices.map(p => p.price))
                      : (item.actualPrice ?? item.estimatedPrice ?? null);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Product info */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          {cat && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider mt-0.5 px-2 py-0.2 rounded-full"
                              style={{
                                backgroundColor: `${cat.color}20`,
                                color: cat.color,
                                border: `1px solid ${cat.color}40`,
                              }}
                            >
                              {getCategoryIcon(cat.iconName, 'w-2.5 h-2.5')}
                              {cat.name}
                            </span>
                          )}
                        </td>

                        {/* Quantity */}
                        <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300 font-mono font-medium">
                          {item.quantity} {item.unit}
                        </td>

                        {/* Price per Supermarket */}
                        {supermarkets.map(sm => {
                          const storeRec = storePrices.find(sp => sp.supermarketId === sm.id);
                          const priceVal = storeRec?.price;
                          const isLowest = priceVal && priceVal === minPrice;

                          return (
                            <td key={sm.id} className="py-3 px-3 text-right font-mono">
                              {priceVal ? (
                                <button
                                  onClick={() =>
                                    setEditingPriceData({
                                      itemId: item.id,
                                      itemName: item.name,
                                      supermarketId: sm.id,
                                      currentPrice: priceVal,
                                    })
                                  }
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                                    isLowest
                                      ? 'bg-emerald-50 dark:bg-teal-500/10 text-emerald-700 dark:text-teal-400 border border-emerald-300 dark:border-teal-500/30'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                                  }`}
                                  title="Clique para editar este valor"
                                >
                                  <span>{formatCurrency(priceVal)}</span>
                                  <Edit3 className="w-2.5 h-2.5 opacity-40 hover:opacity-100" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    setEditingPriceData({
                                      itemId: item.id,
                                      itemName: item.name,
                                      supermarketId: sm.id,
                                      currentPrice: '',
                                    })
                                  }
                                  className="text-slate-400 hover:text-emerald-600 dark:hover:text-teal-400 text-[11px] p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  title={`Registrar preço no ${sm.name}`}
                                >
                                  + Cadastrar
                                </button>
                              )}
                            </td>
                          );
                        })}

                        {/* Lowest Price Column */}
                        <td className="py-3 px-4 text-right font-bold font-mono text-emerald-600 dark:text-teal-400">
                          {minPrice ? formatCurrency(minPrice) : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Quick Price Edit Modal */}
      {editingPriceData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div ref={priceDialogRef} role="dialog" aria-modal="true" aria-label="Atualizar preço" className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Atualizar Preço no Supermercado
              </h4>
              <button
                onClick={() => setEditingPriceData(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {editingPriceData.itemName}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-teal-400 font-medium">
                {supermarkets.find(s => s.id === editingPriceData.supermarketId)?.name}
              </p>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Novo Preço Unitário (R$)
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="0,00"
                  value={editingPriceData.currentPrice}
                  onChange={e =>
                    setEditingPriceData({
                      ...editingPriceData,
                      currentPrice: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPriceData(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md cursor-pointer"
                >
                  Salvar Preço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
