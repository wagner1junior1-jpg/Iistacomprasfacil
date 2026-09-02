import React from 'react';
import { ShoppingItem, Category, Supermarket } from '../../types';
import { getProductThumbnail } from '../../utils/productImages';
import { formatCurrency } from '../../utils/helpers';
import { Check, Edit2, Trash2, Store, Plus, Minus, History } from 'lucide-react';

interface ItemCardProps {
  item: ShoppingItem;
  category?: Category;
  supermarkets: Supermarket[];
  lastPurchasedPrice?: { price: number; supermarketName?: string; date?: string } | null;
  onToggleBought: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity?: (id: string, delta: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  category,
  supermarkets,
  lastPurchasedPrice,
  onToggleBought,
  onEdit,
  onDelete,
  onUpdateQuantity,
}) => {
  const unitPrice = item.actualPrice ?? item.estimatedPrice;
  const totalPrice = unitPrice ? unitPrice * item.quantity : null;

  const currentSm = item.supermarketId
    ? supermarkets.find(s => s.id === item.supermarketId)?.name
    : null;

  return (
    <div
      id={`item-row-${item.id}`}
      className="group flex items-center justify-between px-3 sm:px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800/80 transition-colors select-none"
    >
      {/* Left: Product Thumbnail + Title / Details */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0 pr-2 cursor-pointer"
        onClick={() => onEdit(item)}
      >
        {/* Product Thumbnail (Round Circle) */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
          {getProductThumbnail(item.name, item.categoryId, item.customImage)}
        </div>

        {/* Name and Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-base leading-snug truncate font-medium transition-all ${
                item.bought
                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                  : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {item.name}
            </span>
          </div>

          {/* Subtitle / Details (Quantity, Price, Store, Last Price) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            
            {/* Quick +/- Quantity Buttons */}
            {onUpdateQuantity && !item.bought ? (
              <div
                className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 p-0.5 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Diminuir quantidade"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-200">
                  {item.quantity} {item.unit}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Aumentar quantidade"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {item.quantity} {item.unit}
              </span>
            )}

            {/* Price if available */}
            {totalPrice !== null && (
              <>
                <span>•</span>
                <span className={`font-mono ${item.bought ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}`}>
                  {formatCurrency(totalPrice)}
                </span>
              </>
            )}

            {/* Store */}
            {currentSm && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  <Store className="w-3 h-3 text-slate-400" />
                  {currentSm}
                </span>
              </>
            )}

            {/* Histórico do último preço pago */}
            {lastPurchasedPrice && (
              <span
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40 font-mono"
                title={`Último valor pago: ${formatCurrency(lastPurchasedPrice.price)} em ${lastPurchasedPrice.date || 'compra anterior'}`}
              >
                <History className="w-2.5 h-2.5 shrink-0" />
                Último: {formatCurrency(lastPurchasedPrice.price)}
              </span>
            )}

            {/* Notes */}
            {item.notes && (
              <span className="text-[11px] italic text-slate-400 truncate max-w-[130px]">
                ({item.notes})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions & Large Touch Square Checkbox */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* Delete Item Button (Always visible on mobile & desktop) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Deseja remover "${item.name}" da lista?`)) {
              onDelete(item.id);
            }
          }}
          className="p-1.5 sm:p-2 text-slate-300 hover:text-red-500 active:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
          title={`Excluir ${item.name} da lista`}
          aria-label={`Excluir ${item.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Square Checkbox with comfortable thumb tap area for mobile */}
        <div className="p-1 -m-1 flex items-center justify-center">
          <button
            id={`checkbox-item-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBought(item.id);
            }}
            className={`w-7 h-7 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              item.bought
                ? 'bg-[#B8DAC0] dark:bg-emerald-600 border border-[#9FC8A8] dark:border-emerald-500 text-emerald-900 dark:text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-emerald-500'
            }`}
            title={item.bought ? 'Desmarcar do carrinho' : 'Marcar como comprado (colocar no carrinho)'}
            aria-label={item.bought ? 'Desmarcar' : 'Marcar'}
          >
            {item.bought && <Check className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>

      </div>
    </div>
  );
};

