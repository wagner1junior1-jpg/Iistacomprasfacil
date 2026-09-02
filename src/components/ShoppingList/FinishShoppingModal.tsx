import React, { useState, useEffect } from 'react';
import { ShoppingItem, Supermarket } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { CheckCircle2, Store, Calendar, DollarSign, X, ArrowRight } from 'lucide-react';

interface FinishShoppingModalProps {
  isOpen: boolean;
  boughtItems: ShoppingItem[];
  supermarkets: Supermarket[];
  onClose: () => void;
  onConfirm: (data: {
    title: string;
    supermarketId?: string | null;
    supermarketName?: string;
    totalSpent?: number;
    notes?: string;
    archiveBoughtItemsOnly: boolean;
  }) => void;
}

export const FinishShoppingModal: React.FC<FinishShoppingModalProps> = ({
  isOpen,
  boughtItems,
  supermarkets,
  onClose,
  onConfirm,
}) => {
  const [selectedSupermarketId, setSelectedSupermarketId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [totalSpentStr, setTotalSpentStr] = useState('');
  const [notes, setNotes] = useState('');
  const [archiveBoughtOnly, setArchiveBoughtOnly] = useState(true);

  // Calculate default total
  const autoCalculatedTotal = boughtItems.reduce((sum, item) => {
    const price = item.actualPrice ?? item.estimatedPrice ?? 0;
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (isOpen) {
      // Pick most frequent supermarket among bought items if any
      const smCount: Record<string, number> = {};
      boughtItems.forEach(i => {
        if (i.supermarketId) {
          smCount[i.supermarketId] = (smCount[i.supermarketId] || 0) + 1;
        }
      });
      const topSm = Object.keys(smCount).sort((a, b) => smCount[b] - smCount[a])[0];
      const initialSm = topSm || supermarkets[0]?.id || '';
      setSelectedSupermarketId(initialSm);

      const smName = supermarkets.find(s => s.id === initialSm)?.name || 'Supermercado';
      const today = new Date().toLocaleDateString('pt-BR');
      setTitle(`Compra Mensal - ${smName} (${today})`);
      setTotalSpentStr(autoCalculatedTotal > 0 ? autoCalculatedTotal.toFixed(2) : '');
      setNotes('');
      setArchiveBoughtOnly(true);
    }
  }, [isOpen, boughtItems, supermarkets, autoCalculatedTotal]);

  if (!isOpen) return null;

  const handleSupermarketChange = (smId: string) => {
    setSelectedSupermarketId(smId);
    const smName = supermarkets.find(s => s.id === smId)?.name || 'Supermercado';
    const today = new Date().toLocaleDateString('pt-BR');
    setTitle(`Compra Mensal - ${smName} (${today})`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const smFound = supermarkets.find(s => s.id === selectedSupermarketId);
    const parsedTotal = totalSpentStr ? parseFloat(totalSpentStr.replace(',', '.')) : autoCalculatedTotal;

    onConfirm({
      title: title.trim() || `Compra - ${new Date().toLocaleDateString('pt-BR')}`,
      supermarketId: selectedSupermarketId || null,
      supermarketName: smFound?.name || 'Supermercado',
      totalSpent: isNaN(parsedTotal) ? autoCalculatedTotal : parsedTotal,
      notes: notes.trim() || undefined,
      archiveBoughtItemsOnly: archiveBoughtOnly,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Finalizar Compra Mensal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Salvar no histórico financeiro deste mês
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800 dark:text-slate-100">
          
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Itens riscados/comprados</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {boughtItems.length} {boughtItems.length === 1 ? 'produto' : 'produtos'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">Soma dos Itens</span>
              <div className="text-lg font-bold text-emerald-600 dark:text-teal-400 font-mono">
                {formatCurrency(autoCalculatedTotal)}
              </div>
            </div>
          </div>

          {/* Supermarket Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              Onde você realizou esta compra?
            </label>
            <select
              id="finish-supermarket-select"
              value={selectedSupermarketId}
              onChange={e => handleSupermarketChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {supermarkets.map(sm => (
                <option key={sm.id} value={sm.id} className="dark:bg-slate-800">
                  {sm.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Título / Identificação do Registro
            </label>
            <input
              id="finish-title-input"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Final Receipt Total (Optional overwrite) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-teal-400" />
                Valor Total Gasto no Cupom Fiscal (R$)
              </span>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </label>
            <input
              id="finish-total-spent-input"
              type="text"
              placeholder="0,00"
              value={totalSpentStr}
              onChange={e => setTotalSpentStr(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Caso tenha tido desconto ou produtos não precificados na lista, digite o total real do cupom.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Anotações adicionais (Opcional)
            </label>
            <input
              id="finish-notes-input"
              type="text"
              placeholder="Ex: Pagamento no cartão de alimentação, promoções de feira..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="finish-btn-confirm"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Salvar no Histórico</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
