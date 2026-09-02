import React, { useState, useEffect, useRef } from 'react';
import { ShoppingItem, Category, Supermarket, UnitType, StorePrice } from '../../types';
import {
  ArrowLeft,
  Check,
  Mic,
  MicOff,
  Camera,
  ShoppingCart,
  Pencil,
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { getProductThumbnail } from '../../utils/productImages';
import { compressImage } from '../../utils/imageCompressor';
import { searchCatalogProducts, CatalogProduct, PRODUCT_CATALOG } from '../../data/productCatalog';
import { getCategoryIcon } from '../../utils/icons';

interface ItemModalProps {
  isOpen: boolean;
  itemToEdit: ShoppingItem | null;
  initialName?: string;
  categories: Category[];
  supermarkets: Supermarket[];
  onClose: () => void;
  onSave: (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
}

const UNIT_OPTIONS: { value: UnitType; label: string }[] = [
  { value: 'un', label: 'un' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'L', label: 'L' },
  { value: 'ml', label: 'ml' },
  { value: 'pct', label: 'pct' },
  { value: 'cx', label: 'cx' },
  { value: 'dz', label: 'dz' },
  { value: 'fd', label: 'fd' },
  { value: 'lata', label: 'lata' },
];

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  itemToEdit,
  initialName = '',
  categories,
  supermarkets,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<UnitType>('un');
  const [price, setPrice] = useState<string>('');
  const [insertInCart, setInsertInCart] = useState<boolean>(false);
  const [supermarketId, setSupermarketId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [customImage, setCustomImage] = useState<string>('');
  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);
  const [catalogSuggestions, setCatalogSuggestions] = useState<CatalogProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategoryId(itemToEdit.categoryId || categories[0]?.id || 'cat-mercearia');
      setQuantity(itemToEdit.quantity || 1);
      setUnit(itemToEdit.unit || 'un');
      const val = itemToEdit.actualPrice ?? itemToEdit.estimatedPrice;
      setPrice(val ? val.toString() : '');
      setInsertInCart(itemToEdit.bought || false);
      setSupermarketId(itemToEdit.supermarketId || '');
      setNotes(itemToEdit.notes || '');
      setCustomImage(itemToEdit.customImage || '');
      setStorePrices(itemToEdit.storePrices || []);
      setShowSuggestions(false);
    } else {
      const initN = initialName ? initialName.trim() : '';
      setName(initN);
      if (initN) {
        const detected = guessCategoryId(initN);
        setCategoryId(detected);
        const matches = searchCatalogProducts(initN, 5);
        setCatalogSuggestions(matches);
      } else {
        setCategoryId(categories[0]?.id || 'cat-mercearia');
      }
      setQuantity(1);
      setUnit('un');
      setPrice('');
      setInsertInCart(false);
      setSupermarketId('');
      setNotes('');
      setCustomImage('');
      setStorePrices([]);
      setShowSuggestions(false);
    }
  }, [itemToEdit, initialName, categories, isOpen]);

  if (!isOpen) return null;

  // Auto-detect category from voice / text input
  const guessCategoryId = (text: string): string => {
    const t = text.toLowerCase();
    if (/banana|maçã|tomate|alface|cebola|alho|laranja|limão|batata|cenoura|fruta|legume|mamão|uva|abacaxi/i.test(t)) {
      return 'cat-hortifruti';
    }
    if (/carne|frango|alcatra|picanha|peito|moída|peixe|salmão|linguiça|bacon|costela|porco|bife/i.test(t)) {
      return 'cat-carnes';
    }
    if (/arroz|feijão|óleo|azeite|açúcar|sal|farinha|macarrão|café|molho|milho|ervilha|atum|sardinha/i.test(t)) {
      return 'cat-mercearia';
    }
    if (/leite|queijo|requeijão|manteiga|iogurte|presunto|mussarela|creme de leite|leite condensado/i.test(t)) {
      return 'cat-laticinios';
    }
    if (/detergente|sabão|amaciante|desinfetante|água sanitária|esponja|multiuso|limpeza|lisoform/i.test(t)) {
      return 'cat-limpeza';
    }
    if (/sabonete|shampoo|condicionador|pasta de dente|creme dental|desodorante|papel higiênico|fio dental|barba/i.test(t)) {
      return 'cat-higiene';
    }
    if (/pão|bolo|torrada|biscoito|bolacha|croissant/i.test(t)) {
      return 'cat-padaria';
    }
    if (/suco|refrigerante|cerveja|água mineral|vinho|chá|vodka|energético/i.test(t)) {
      return 'cat-bebidas';
    }
    return categories[0]?.id || 'cat-mercearia';
  };

  // Speech Recognition (Portuguese BR)
  const toggleVoiceInput = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não suportado neste navegador. Use o teclado para digitar.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setName(transcript);
          const detected = guessCategoryId(transcript);
          if (detected) setCategoryId(detected);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 0.75);
        setCustomImage(compressed);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCustomImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = price ? parseFloat(price.replace(',', '.')) : null;

    onSave({
      name: name.trim(),
      categoryId: categoryId || categories[0]?.id || 'cat-mercearia',
      quantity: quantity > 0 ? quantity : 1,
      unit,
      actualPrice: insertInCart && parsedPrice !== null ? parsedPrice : null,
      estimatedPrice: !insertInCart && parsedPrice !== null ? parsedPrice : null,
      bought: insertInCart,
      supermarketId: supermarketId || null,
      notes: notes.trim() || undefined,
      customImage: customImage || undefined,
      storePrices: storePrices.length > 0 ? storePrices : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md min-h-screen sm:min-h-0 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar - Matching Screenshot 2 */}
        <div className="bg-[#2F7D4E] text-white px-4 h-14 flex items-center justify-between shadow-md shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h2 className="text-lg font-medium text-white tracking-wide">
            {itemToEdit ? 'Editar Item' : 'Novo Item'}
          </h2>

          <div className="flex items-center gap-1.5">
            {itemToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Deseja realmente excluir "${itemToEdit.name}" da lista?`)) {
                    onDelete(itemToEdit.id);
                  }
                }}
                className="p-1.5 rounded-full hover:bg-red-600/30 active:bg-red-600/50 text-white transition-colors cursor-pointer"
                title="Excluir este item"
                aria-label="Excluir item"
              >
                <Trash2 className="w-5 h-5 text-red-200 hover:text-white" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={!name.trim()}
              className="p-1.5 -mr-1 rounded-full hover:bg-white/10 active:bg-white/20 text-white disabled:opacity-50 transition-colors cursor-pointer"
              title="Salvar Item"
            >
              <Check className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Form Body - Matching Screenshot 2 Form Layout */}
        <form onSubmit={handleSave} className="flex-1 p-6 space-y-6 overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
          
          {/* 1. Nome with Mic Icon & Catalog Autocomplete */}
          <div className="space-y-1 relative">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#2F7D4E] dark:text-emerald-400">
                Nome do Produto
              </label>
              <span className="text-[10px] text-slate-400">
                {PRODUCT_CATALOG.length} sugestões no catálogo
              </span>
            </div>
            
            <div className="relative flex items-center">
              <input
                id="item-form-name"
                type="text"
                required
                placeholder="Ex: Arroz, Feijão, Sabão em pó, Leite..."
                value={name}
                autoComplete="off"
                onFocus={() => {
                  if (name.trim().length >= 2) {
                    const matches = searchCatalogProducts(name, 5);
                    setCatalogSuggestions(matches);
                    setShowSuggestions(matches.length > 0);
                  }
                }}
                onChange={e => {
                  const val = e.target.value;
                  setName(val);
                  if (val.trim().length >= 2) {
                    const matches = searchCatalogProducts(val, 5);
                    setCatalogSuggestions(matches);
                    setShowSuggestions(matches.length > 0);
                  } else {
                    setShowSuggestions(false);
                  }
                  if (!categoryId || categoryId === 'cat-mercearia') {
                    const detected = guessCategoryId(val);
                    if (detected) setCategoryId(detected);
                  }
                }}
                className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-colors pr-10"
                autoFocus={!itemToEdit}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`absolute right-1 bottom-2 p-1.5 rounded-full transition-colors cursor-pointer ${
                  isListening
                    ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-950/50'
                    : 'text-slate-400 hover:text-[#2F7D4E] dark:hover:text-emerald-400'
                }`}
                title={isListening ? 'Ouvindo... Fale agora' : 'Falar nome do produto por voz'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            {/* Catalog Autocomplete Suggestions Dropdown */}
            {showSuggestions && catalogSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-56 overflow-y-auto">
                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>Sugestões do Catálogo</span>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    Fechar ✕
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {catalogSuggestions.map(sug => {
                    const cat = categories.find(c => c.id === sug.categoryId);
                    return (
                      <div
                        key={sug.id}
                        onClick={() => {
                          setName(sug.name);
                          setCategoryId(sug.categoryId);
                          setUnit(sug.suggestedUnit);
                          if (!price && sug.averagePrice) {
                            setPrice(sug.averagePrice.toFixed(2));
                          }
                          setShowSuggestions(false);
                        }}
                        className="p-2.5 hover:bg-emerald-50 dark:hover:bg-slate-700/60 cursor-pointer transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {sug.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {cat && (
                              <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-medium"
                                style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                              >
                                {cat.name}
                              </span>
                            )}
                            <span>•</span>
                            <span>Un: {sug.suggestedUnit}</span>
                          </div>
                        </div>

                        {sug.averagePrice && (
                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-teal-400">
                              R$ {sug.averagePrice.toFixed(2)}
                            </span>
                            <span className="block text-[9px] text-slate-400">estimado</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Indicator for Custom Product (When typing something not in catalog) */}
            {name.trim().length >= 3 && !PRODUCT_CATALOG.some(p => p.name.toLowerCase() === name.trim().toLowerCase()) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Item personalizado:</strong> Você pode cadastrar livremente qualquer produto novo que desejar.
                </span>
              </div>
            )}

            {isListening && (
              <span className="text-[11px] text-red-500 animate-pulse block font-medium">
                🎙️ Ouvindo... Fale o nome do produto (Ex: Arroz, Detergente, Banana...)
              </span>
            )}
          </div>

          {/* 2. Quantidade & Unidade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Quantidade
              </label>
              <input
                id="item-form-qty"
                type="number"
                min="0.1"
                step="0.1"
                required
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-base text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Unidade
              </label>
              <select
                id="item-form-unit"
                value={unit}
                onChange={e => setUnit(e.target.value as UnitType)}
                className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-base text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {UNIT_OPTIONS.map(u => (
                  <option key={u.value} value={u.value} className="dark:bg-slate-800">
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Preço & Inserir no Carrinho */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Preço (R$)
              </label>
              <input
                id="item-form-price"
                type="text"
                placeholder="0,00"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-base text-slate-900 dark:text-white font-mono outline-none"
              />
            </div>

            {/* Inserir no carrinho checkbox */}
            <div className="pb-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Inserir no carrinho
              </label>
              <button
                type="button"
                onClick={() => setInsertInCart(!insertInCart)}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer select-none"
              >
                <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <div
                  className={`w-5 h-5 rounded-xs border-2 flex items-center justify-center transition-all ${
                    insertInCart
                      ? 'bg-[#B8DAC0] dark:bg-emerald-600 border-[#9FC8A8] text-emerald-900 dark:text-white'
                      : 'border-slate-400 bg-white dark:bg-slate-800'
                  }`}
                >
                  {insertInCart && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* 4. Categoria */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Categoria
            </label>
            <div className="flex items-center gap-2">
              <select
                id="item-form-category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-base text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="dark:bg-slate-800">
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="p-2 text-slate-400">
                <Pencil className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 5. Supermercado (Opcional) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Supermercado de preferência
            </label>
            <select
              id="item-form-supermarket"
              value={supermarketId}
              onChange={e => setSupermarketId(e.target.value)}
              className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="" className="dark:bg-slate-800">Qualquer / Não definido</option>
              {supermarkets.map(sm => (
                <option key={sm.id} value={sm.id} className="dark:bg-slate-800">
                  {sm.name}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Observação */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Observação
            </label>
            <input
              id="item-form-notes"
              type="text"
              placeholder="Ex: Marca de preferência, tamanho..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full pb-2 pt-1 border-b-2 border-slate-300 dark:border-slate-700 focus:border-[#2F7D4E] dark:focus:border-emerald-400 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
          </div>

          {/* 7. Foto (Matching Screenshot 2 Camera Box) */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Foto
            </label>
            
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              
              {/* Photo Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2F7D4E] flex flex-col items-center justify-center p-2 text-slate-400 hover:text-[#2F7D4E] cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/40 relative overflow-hidden"
              >
                {customImage ? (
                  <>
                    <img
                      src={customImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomImage('');
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[10px] text-center opacity-60">Toque para foto</span>
                  </>
                )}
              </div>

              {/* Automatic Graphic Preview */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xs">
                  {getProductThumbnail(name || 'item', categoryId, customImage)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block text-slate-700 dark:text-slate-200">
                    Ícone Automático
                  </span>
                  <span>Ilustração gerada para a lista</span>
                </div>
              </div>

            </div>
          </div>

          {/* Delete Product Button (When editing existing item) */}
          {itemToEdit && onDelete && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Deseja realmente excluir "${itemToEdit.name}" da lista de compras?`)) {
                    onDelete(itemToEdit.id);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir este produto da lista</span>
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
