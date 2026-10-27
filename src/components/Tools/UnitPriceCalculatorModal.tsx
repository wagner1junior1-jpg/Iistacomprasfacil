import React, { useState } from 'react';
import { Scale, X, Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useModalA11y } from '../../utils/useModalA11y';

interface UnitPriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitPriceCalculatorModal: React.FC<UnitPriceCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [unitType, setUnitType] = useState<'weight' | 'volume' | 'units'>('weight');

  // Opção A
  const [priceA, setPriceA] = useState('');
  const [qtyA, setQtyA] = useState('');

  // Opção B
  const [priceB, setPriceB] = useState('');
  const [qtyB, setQtyB] = useState('');

  // Unidade digitada em cada embalagem: 'sub' = g / ml, 'base' = kg / L
  const [unitA, setUnitA] = useState<'sub' | 'base'>('sub');
  const [unitB, setUnitB] = useState<'sub' | 'base'>('sub');
  const dialogRef = useModalA11y(isOpen, onClose);

  if (!isOpen) return null;

  const numPriceA = parseFloat(priceA.replace(',', '.')) || 0;
  const numQtyA = parseFloat(qtyA.replace(',', '.')) || 0;

  const numPriceB = parseFloat(priceB.replace(',', '.')) || 0;
  const numQtyB = parseFloat(qtyB.replace(',', '.')) || 0;

  // Calcula custo padronizado (por kg / por litro / por unidade).
  // Quantidades em g / ml são convertidas para kg / L antes da divisão.
  const calculateNormalized = (price: number, qty: number, unit: 'sub' | 'base') => {
    if (price <= 0 || qty <= 0) return null;
    const baseQty = unitType !== 'units' && unit === 'sub' ? qty / 1000 : qty;
    return price / baseQty;
  };

  const costPerUnitA = calculateNormalized(numPriceA, numQtyA, unitA);
  const costPerUnitB = calculateNormalized(numPriceB, numQtyB, unitB);

  const costUnitLabel = unitType === 'weight' ? 'kg' : unitType === 'volume' ? 'L' : 'un';
  const unitOptions = unitType === 'weight'
    ? { sub: 'g', base: 'kg' }
    : { sub: 'ml', base: 'L' };

  let winner: 'A' | 'B' | 'equal' | null = null;
  let percentDiff = 0;

  if (costPerUnitA !== null && costPerUnitB !== null) {
    if (Math.abs(costPerUnitA - costPerUnitB) < 0.0001) {
      winner = 'equal';
    } else if (costPerUnitA < costPerUnitB) {
      winner = 'A';
      percentDiff = Math.round(((costPerUnitB - costPerUnitA) / costPerUnitB) * 100);
    } else {
      winner = 'B';
      percentDiff = Math.round(((costPerUnitA - costPerUnitB) / costPerUnitA) * 100);
    }
  }

  const handleClear = () => {
    setPriceA('');
    setQtyA('');
    setPriceB('');
    setQtyB('');
    setUnitA('sub');
    setUnitB('sub');
  };

  // Campo de quantidade + seletor de unidade (g/kg ou ml/L) de uma embalagem
  const renderQtyField = (
    qty: string,
    setQty: (v: string) => void,
    unit: 'sub' | 'base',
    setUnit: (v: 'sub' | 'base') => void,
    placeholder: string
  ) => (
    <div>
      <label className="block text-[11px] text-slate-500 dark:text-slate-400">
        Quantidade{unitType === 'units' ? ' (unidades)' : ''}
      </label>
      <div className="flex gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={qty}
          onChange={e => setQty(e.target.value)}
          className="w-full min-w-0 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        {unitType !== 'units' && (
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as 'sub' | 'base')}
            aria-label="Unidade de medida"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="sub">{unitOptions.sub}</option>
            <option value="base">{unitOptions.base}</option>
          </select>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Tira-Teima de Preço" className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#2F7D4E] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Tira-Teima de Preço</h3>
              <p className="text-[11px] text-emerald-100">Qual embalagem compensa mais no mercado?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[85vh] text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
          
          {/* Tipo de Medida */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setUnitType('weight')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                unitType === 'weight' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              Peso (g / kg)
            </button>
            <button
              onClick={() => setUnitType('volume')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                unitType === 'volume' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              Volume (ml / L)
            </button>
            <button
              onClick={() => setUnitType('units')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                unitType === 'units' ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              Unidades (pct / rolo)
            </button>
          </div>

          {/* Cards de Comparação A vs B */}
          <div className="grid grid-cols-2 gap-3">
            {/* Opção A */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              winner === 'A'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Embalagem A
                </span>
                {winner === 'A' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    MELHOR
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400">Preço (R$)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 14,90"
                    value={priceA}
                    onChange={e => setPriceA(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {renderQtyField(qtyA, setQtyA, unitA, setUnitA, 'Ex: 350')}
                {costPerUnitA !== null && (
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Preço por {costUnitLabel}:</span>
                    <span className="font-bold font-mono text-xs text-slate-800 dark:text-white">
                      R$ {costPerUnitA.toFixed(2)} / {costUnitLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Opção B */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              winner === 'B'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Embalagem B
                </span>
                {winner === 'B' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    MELHOR
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400">Preço (R$)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 19,90"
                    value={priceB}
                    onChange={e => setPriceB(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {renderQtyField(qtyB, setQtyB, unitB, setUnitB, 'Ex: 500')}
                {costPerUnitB !== null && (
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Preço por {costUnitLabel}:</span>
                    <span className="font-bold font-mono text-xs text-slate-800 dark:text-white">
                      R$ {costPerUnitB.toFixed(2)} / {costUnitLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Veredito */}
          {winner && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95 duration-150 ${
              winner === 'equal'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-200'
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-950 dark:text-emerald-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                {winner === 'equal' ? (
                  <>
                    <h4 className="font-bold text-sm">Ambas têm o mesmo custo unitário!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tanto faz escolher A ou B.</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-sm">
                      A <span className="underline font-black">Embalagem {winner}</span> é mais econômica!
                    </h4>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      Você economiza aproximadamente <b>{percentDiff}%</b> levando a Embalagem {winner}.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar valores</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Concluído
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
