import React, { useState, useMemo } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import {
  formatCurrency,
  formatMonthName,
  getMonthKey,
  getNextMonthKey,
  getPreviousMonthKey,
} from '../../utils/helpers';
import { getCategoryIcon } from '../../utils/icons';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart as PieIcon,
  BarChart3,
  Store,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Receipt,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';

export const FinancialDashboardView: React.FC = () => {
  const {
    trips,
    categories,
    supermarkets,
    settings,
    setMonthlyBudget,
    deleteTrip,
    exportCsv,
  } = useShopping();

  // Current selected month for detailed filtering (defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getMonthKey(new Date()));
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState('');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  // Trips in selected month
  const currentMonthTrips = useMemo(() => {
    return trips.filter(t => t.month === selectedMonth);
  }, [trips, selectedMonth]);

  // Current month total spent
  const currentMonthTotalSpent = useMemo(() => {
    return currentMonthTrips.reduce((sum, t) => sum + (t.totalSpent || 0), 0);
  }, [currentMonthTrips]);

  // Budget for current month
  const currentMonthBudget = settings.monthlyBudgets[selectedMonth] || 1000;
  const budgetRemaining = currentMonthBudget - currentMonthTotalSpent;
  const budgetPercentage = currentMonthBudget > 0 ? Math.min(100, Math.round((currentMonthTotalSpent / currentMonthBudget) * 100)) : 0;

  // Next month planning calculations
  const nextMonthKey = getNextMonthKey(selectedMonth);
  const nextMonthBudget = settings.monthlyBudgets[nextMonthKey] || currentMonthBudget;

  // Average monthly spending across all recorded months
  const allMonthsSet: string[] = Array.from(new Set<string>(trips.map(t => t.month))).sort();
  const monthlySpendingMap = useMemo(() => {
    const map: Record<string, number> = {};
    trips.forEach(t => {
      map[t.month] = (map[t.month] || 0) + (t.totalSpent || 0);
    });
    return map;
  }, [trips]);

  // Calculate Next Month Projected Spending (average of past 3 months + slight inflation adjust)
  const projectedNextMonthSpent = useMemo(() => {
    const values: number[] = Object.values(monthlySpendingMap);
    if (values.length === 0) return currentMonthTotalSpent || currentMonthBudget;
    const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    return avg;
  }, [monthlySpendingMap, currentMonthTotalSpent, currentMonthBudget]);

  // 1. Chart Data: Monthly Spending Timeline (Last 6 Months)
  const monthlyTimelineData = useMemo(() => {
    // Generate chronological array of months up to next month
    const months: string[] = [...allMonthsSet];
    if (!months.includes(selectedMonth)) months.push(selectedMonth);
    months.sort();

    return months.map((m: string) => {
      const spent = monthlySpendingMap[m] || 0;
      const budget = settings.monthlyBudgets[m] || 1000;
      return {
        monthKey: m,
        monthLabel: formatMonthName(m).split(' ')[0], // e.g. "Agosto"
        Gasto: spent,
        Orçamento: budget,
      };
    });
  }, [allMonthsSet, selectedMonth, monthlySpendingMap, settings.monthlyBudgets]);

  // 2. Chart Data: Category Breakdown for selected month
  const categoryChartData = useMemo(() => {
    const catTotalMap: Record<string, number> = {};

    currentMonthTrips.forEach(trip => {
      trip.items.forEach(item => {
        const catId = item.categoryId || 'cat-outros';
        const price = item.actualPrice ?? item.estimatedPrice ?? 0;
        const total = price * item.quantity;
        catTotalMap[catId] = (catTotalMap[catId] || 0) + total;
      });
    });

    return categories
      .map(cat => {
        const total = catTotalMap[cat.id] || 0;
        return {
          name: cat.name,
          value: Math.round(total * 100) / 100,
          color: cat.color,
          icon: cat.iconName,
        };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTrips, categories]);

  // 3. Chart Data: Supermarket Spending Distribution for selected month
  const supermarketChartData = useMemo(() => {
    const smTotalMap: Record<string, number> = {};

    currentMonthTrips.forEach(trip => {
      const smName = trip.supermarketName || 'Outro';
      smTotalMap[smName] = (smTotalMap[smName] || 0) + trip.totalSpent;
    });

    return Object.entries(smTotalMap).map(([name, total]) => ({
      name,
      total: Math.round(total * 100) / 100,
    })).sort((a, b) => b.total - a.total);
  }, [currentMonthTrips]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      setMonthlyBudget(selectedMonth, val);
    }
    setIsEditingBudget(false);
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(getPreviousMonthKey(selectedMonth));
  };

  const handleNextMonth = () => {
    setSelectedMonth(getNextMonthKey(selectedMonth));
  };

  const toggleTripExpand = (tripId: string) => {
    setExpandedTripId(prev => (prev === tripId ? null : tripId));
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Month Navigator Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1E293B] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Month Selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center sm:text-left px-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatMonthName(selectedMonth)}
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {currentMonthTrips.length} {currentMonthTrips.length === 1 ? 'compra registrada' : 'compras registradas'}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Próximo Mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick CSV Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            title="Exportar dados para Excel ou Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
            <span>Exportar Planilha CSV</span>
          </button>
        </div>

      </div>

      {/* KPI Cards: Gasto Mensal / Orçamento / Planejamento Próximo Mês */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Total Spent in Month */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Total Gasto no Mês</span>
            <Receipt className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">
            {formatCurrency(currentMonthTotalSpent)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Em {currentMonthTrips.length} compras de supermercado
          </p>
        </div>

        {/* Monthly Budget Tracker */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>Meta de Orçamento</span>
            <button
              onClick={() => {
                setTempBudgetInput(currentMonthBudget.toString());
                setIsEditingBudget(!isEditingBudget);
              }}
              className="text-emerald-600 dark:text-teal-400 hover:underline text-[11px] cursor-pointer font-medium"
            >
              {isEditingBudget ? 'Fechar' : 'Ajustar Meta'}
            </button>
          </div>

          {isEditingBudget ? (
            <form onSubmit={handleSaveBudget} className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={tempBudgetInput}
                onChange={e => setTempBudgetInput(e.target.value)}
                placeholder="R$ 1000"
                className="w-full px-2.5 py-1 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
              >
                Salvar
              </button>
            </form>
          ) : (
            <div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                {formatCurrency(currentMonthBudget)}
              </div>
              <div className="flex items-center justify-between text-[11px] mt-2 mb-1 text-slate-500 dark:text-slate-400">
                <span className="font-mono">{budgetPercentage}% utilizado</span>
                <span className={budgetRemaining >= 0 ? 'text-emerald-600 dark:text-teal-400 font-mono font-semibold' : 'text-red-500 dark:text-red-400 font-mono font-semibold'}>
                  {budgetRemaining >= 0 ? `Resta ${formatCurrency(budgetRemaining)}` : `Excedeu ${formatCurrency(Math.abs(budgetRemaining))}`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercentage > 100 ? 'bg-red-500' : 'bg-emerald-600 dark:bg-teal-500'
                  }`}
                  style={{ width: `${Math.min(100, budgetPercentage)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Planejamento Financeiro Próximo Mês */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-teal-950/40 dark:to-[#1E293B] border border-emerald-200 dark:border-teal-500/30 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-teal-300 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-teal-400" />
              Planejamento Próximo Mês
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-teal-400 bg-emerald-100 dark:bg-teal-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-teal-500/20">Previsão</span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-800 dark:text-teal-300">
            {formatCurrency(projectedNextMonthSpent)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Projeção calculada com base no padrão médio mensal de compras.
          </p>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Chart 1: Evolução Mensal dos Gastos (BarChart) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
              <span>Evolução dos Gastos Mensais (R$)</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Histórico de despesas e comparação com o orçamento
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#64748b" />
                <XAxis dataKey="monthLabel" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Gasto" fill="#059669" radius={[6, 6, 0, 0]} name="Gasto Realizado" />
                <Bar dataKey="Orçamento" fill="#94a3b8" radius={[6, 6, 0, 0]} opacity={0.5} name="Meta / Orçamento" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Divisão por Categorias (Pie / Donut Chart) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
              <span>Despesas por Categoria ({formatMonthName(selectedMonth).split(' ')[0]})</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Distribuição dos gastos por tipo de produto
            </span>
          </div>

          {categoryChartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4">
              <Layers className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nenhum item com preço registrado neste mês.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 h-64">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#10b981'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val), '']}
                      contentStyle={{
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend with custom colors */}
              <div className="space-y-1.5 overflow-y-auto max-h-56 pr-2 no-scrollbar">
                {categoryChartData.map(cat => {
                  const percent = currentMonthTotalSpent > 0
                    ? Math.round((cat.value / currentMonthTotalSpent) * 100)
                    : 0;
                  return (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-slate-700 dark:text-slate-300 truncate">
                          {cat.name}
                        </span>
                      </div>
                      <div className="text-right font-mono font-semibold text-slate-900 dark:text-white shrink-0 ml-2">
                        {formatCurrency(cat.value)} <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({percent}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Shopping Trips History List for this Month */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
            <span>Histórico de Compras Realizadas em {formatMonthName(selectedMonth)}</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Total: {formatCurrency(currentMonthTotalSpent)}
          </span>
        </div>

        {currentMonthTrips.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nenhuma compra finalizada neste mês ainda. As compras finalizadas na aba "Lista de Compras" aparecerão aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentMonthTrips.map(trip => {
              const isExpanded = expandedTripId === trip.id;
              return (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Trip Card Header */}
                  <div
                    onClick={() => toggleTripExpand(trip.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#0F172A] border border-emerald-100 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-teal-400 font-bold">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {trip.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{new Date(trip.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>{trip.supermarketName || 'Supermercado'}</span>
                          <span>•</span>
                          <span>{trip.itemsCount} produtos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold font-mono text-sm sm:text-base text-emerald-600 dark:text-teal-400">
                          {formatCurrency(trip.totalSpent)}
                        </div>
                        {trip.totalEstimated > 0 && trip.totalEstimated !== trip.totalSpent && (
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            Est: {formatCurrency(trip.totalEstimated)}
                          </div>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Items Breakdown */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-3 bg-slate-50/70 dark:bg-[#0F172A]/50">
                      {trip.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-white dark:bg-[#1E293B] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          Nota: {trip.notes}
                        </p>
                      )}

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Itens desta compra:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {trip.items.map((item, idx) => {
                            const p = item.actualPrice ?? item.estimatedPrice;
                            return (
                              <div
                                key={item.id || idx}
                                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-xs"
                              >
                                <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                                  {item.quantity} {item.unit} {item.name}
                                </span>
                                <span className="font-bold font-mono text-emerald-600 dark:text-teal-400 shrink-0 ml-2">
                                  {p ? formatCurrency(p * item.quantity) : 'Sem valor'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delete trip button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja excluir este registro de compra do histórico?')) {
                              deleteTrip(trip.id);
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir este comprovante do histórico</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
