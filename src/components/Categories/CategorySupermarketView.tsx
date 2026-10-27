import React, { useState } from 'react';
import { useModalA11y } from '../../utils/useModalA11y';
import { useShopping } from '../../context/ShoppingContext';
import { Category, Supermarket } from '../../types';
import { ICON_OPTIONS, COLOR_PALETTE, getCategoryIcon } from '../../utils/icons';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Store,
  Palette,
  Layers,
  Check,
  Building2,
  X
} from 'lucide-react';

export const CategorySupermarketView: React.FC = () => {
  const {
    categories,
    supermarkets,
    items,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupermarket,
    updateSupermarket,
    deleteSupermarket,
  } = useShopping();

  // Category Form Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState(COLOR_PALETTE[0].hex);
  const [catIcon, setCatIcon] = useState(ICON_OPTIONS[0].name);

  // Supermarket Form Modal State
  const [isSupermarketModalOpen, setIsSupermarketModalOpen] = useState(false);
  const [editingSupermarket, setEditingSupermarket] = useState<Supermarket | null>(null);
  const [smName, setSmName] = useState('');
  const [smColor, setSmColor] = useState(COLOR_PALETTE[3].hex);
  const categoryDialogRef = useModalA11y(isCategoryModalOpen, () => setIsCategoryModalOpen(false));
  const supermarketDialogRef = useModalA11y(isSupermarketModalOpen, () => setIsSupermarketModalOpen(false));

  // Open Add / Edit Category
  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatColor(cat.color);
      setCatIcon(cat.iconName);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)].hex);
      setCatIcon(ICON_OPTIONS[0].name);
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName.trim(),
        color: catColor,
        iconName: catIcon,
      });
    } else {
      addCategory({
        name: catName.trim(),
        color: catColor,
        iconName: catIcon,
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Open Add / Edit Supermarket
  const handleOpenSmModal = (sm?: Supermarket) => {
    if (sm) {
      setEditingSupermarket(sm);
      setSmName(sm.name);
      setSmColor(sm.color || COLOR_PALETTE[0].hex);
    } else {
      setEditingSupermarket(null);
      setSmName('');
      setSmColor(COLOR_PALETTE[0].hex);
    }
    setIsSupermarketModalOpen(true);
  };

  const handleSaveSupermarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smName.trim()) return;

    if (editingSupermarket) {
      updateSupermarket(editingSupermarket.id, {
        name: smName.trim(),
        color: smColor,
      });
    } else {
      addSupermarket({
        name: smName.trim(),
        color: smColor,
      });
    }
    setIsSupermarketModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#1E293B] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Categorias Personalizadas & Supermercados
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize suas seções de compras e cadastre os mercados que você costuma frequentar.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Categorias Personalizadas Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
              <span>Categorias de Produtos ({categories.length})</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Organize os itens e visualize gastos por grupo
            </span>
          </div>

          <button
            onClick={() => handleOpenCatModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Categoria</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(cat => {
            const count = items.filter(i => i.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  >
                    {getCategoryIcon(cat.iconName, 'w-5 h-5')}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {cat.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {count} {count === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenCatModal(cat)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                    title="Editar Categoria"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {categories.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir categoria "${cat.name}"? Os itens serão movidos para Outros.`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Categoria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Supermercados Cadastrados Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
              <span>Supermercados Cadastrados ({supermarkets.length})</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Lojas usadas no comparador de preços e histórico
            </span>
          </div>

          <button
            onClick={() => handleOpenSmModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Supermercado</span>
          </button>
        </div>

        {/* Supermarkets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {supermarkets.map(sm => {
            // Count registered prices in this market
            let pricesCount = 0;
            items.forEach(i => {
              if (i.storePrices?.some(sp => sp.supermarketId === sm.id)) {
                pricesCount++;
              }
            });

            return (
              <div
                key={sm.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#0F172A] border border-emerald-100 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-teal-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {sm.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {pricesCount} preços comparados
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenSmModal(sm)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                    title="Editar Supermercado"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {supermarkets.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir supermercado "${sm.name}"?`)) {
                          deleteSupermarket(sm.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Supermercado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div ref={categoryDialogRef} role="dialog" aria-modal="true" aria-label="Categoria" className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria Personalizada'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Produtos Orgânicos, Bebê & Fraldas..."
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cor de Identificação
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setCatColor(c.hex)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shrink-0 cursor-pointer shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    >
                      {catColor === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ícone Representativo
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                  {ICON_OPTIONS.map(opt => {
                    const IconComp = opt.icon;
                    const isSelected = catIcon === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setCatIcon(opt.name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-teal-500/10 border-emerald-500 text-emerald-600 dark:text-teal-400 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={opt.label}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">Prévia:</span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: catColor }}
                >
                  {getCategoryIcon(catIcon, 'w-3.5 h-3.5')}
                  <span>{catName || 'Minha Categoria'}</span>
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Categoria
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Supermarket Modal */}
      {isSupermarketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div ref={supermarketDialogRef} role="dialog" aria-modal="true" aria-label="Supermercado" className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingSupermarket ? 'Editar Supermercado' : 'Novo Supermercado'}
              </h3>
              <button onClick={() => setIsSupermarketModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupermarket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome do Supermercado / Atacadista
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sam's Club, Spani, Supermercado Extra..."
                  value={smName}
                  onChange={e => setSmName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSupermarketModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Supermercado
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
