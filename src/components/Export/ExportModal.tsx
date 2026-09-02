import React, { useState } from 'react';
import { useShopping } from '../../context/ShoppingContext';
import { formatCurrency } from '../../utils/helpers';
import {
  FileSpreadsheet,
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  X,
  Share2,
  FileJson,
  ShieldCheck
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const {
    items,
    trips,
    categories,
    supermarkets,
    exportCsv,
    exportBackupJson,
    importBackupJson,
    resetData,
  } = useShopping();

  const [copiedText, setCopiedText] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const getFormattedListText = () => {
    const catMap = new Map(categories.map(c => [c.id, c.name]));
    let text = `🛒 *MINHA LISTA DE COMPRAS* (${new Date().toLocaleDateString('pt-BR')})\n\n`;

    const pending = items.filter(i => !i.bought);
    const bought = items.filter(i => i.bought);

    if (pending.length > 0) {
      text += `📌 *A COMPRAR (${pending.length}):*\n`;
      pending.forEach(item => {
        const cat = catMap.get(item.categoryId) || 'Geral';
        const priceStr = item.actualPrice || item.estimatedPrice ? ` - ${formatCurrency(item.actualPrice || item.estimatedPrice)}` : '';
        text += `• [ ] ${item.quantity} ${item.unit} ${item.name} (${cat})${priceStr}\n`;
      });
      text += '\n';
    }

    if (bought.length > 0) {
      text += `✅ *NO CARRINHO / COMPRADOS (${bought.length}):*\n`;
      bought.forEach(item => {
        text += `• [x] ~${item.quantity} ${item.unit} ${item.name}~\n`;
      });
    }

    return text;
  };

  // Copy shopping list text for WhatsApp / Notes
  const handleCopyFormattedList = () => {
    const text = getFormattedListText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Native Web Share API (WhatsApp / Apps nativos no celular)
  const handleNativeShare = async () => {
    const text = getFormattedListText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Lista de Compras',
          text,
        });
      } catch (err) {
        // Se o usuário cancelar o menu de compartilhamento, apenas ignora
      }
    } else {
      handleCopyFormattedList();
    }
  };

  // Download JSON Backup
  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_mercadofacil_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import JSON Backup File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const ok = importBackupJson(content);
        if (ok) {
          setImportStatus('Backup restaurado com sucesso!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('Erro: arquivo de backup inválido.');
        }
      } catch (err) {
        setImportStatus('Erro ao ler arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[#0F172A] border border-emerald-200 dark:border-slate-800 text-emerald-600 dark:text-teal-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Exportar & Controle de Dados
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% offline e salvo no seu dispositivo
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

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-slate-800 dark:text-slate-100">
          
          {/* 1. Export Spreadsheet CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Exportar para Planilha (.CSV)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Compatível com Excel, Google Planilhas e LibreOffice com formatação brasileira.
                  </p>
                </div>
              </div>
            </div>

            <button
              id="export-csv-button"
              onClick={() => {
                exportCsv();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha de Gastos (.CSV)</span>
            </button>
          </div>

          {/* 2. Copy formatted WhatsApp text */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Compartilhar Lista de Compras
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Para enviar no WhatsApp ou colar em bloco de notas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </button>
              )}
              <button
                onClick={handleCopyFormattedList}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                    <span className="text-emerald-600 dark:text-teal-400 font-bold">Copiado para a área de transferência!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Backup JSON & Restore */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Backup Completo de Dados (JSON)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Salve ou restaure todas as categorias, listas e histórico.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadBackup}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Salvar Backup</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Restaurar Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <p className="text-xs text-center font-semibold text-emerald-600 dark:text-teal-400">
                {importStatus}
              </p>
            )}
          </div>

          {/* 4. Reset to Initial Seed Data */}
          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <span>Deseja resetar para os dados iniciais de exemplo?</span>
            <button
              onClick={() => {
                if (window.confirm('Atenção: isto recarregará os dados de demonstração iniciais. Deseja continuar?')) {
                  resetData();
                  onClose();
                }
              }}
              className="text-slate-400 hover:text-red-400 underline text-xs cursor-pointer"
            >
              Restaurar Exemplo
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
