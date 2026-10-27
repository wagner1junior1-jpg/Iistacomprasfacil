import { Category, Supermarket, ShoppingItem, ShoppingTrip, UserSettings, StorePrice, ShoppingListGroup } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_SUPERMARKETS, INITIAL_SHOPPING_ITEMS, INITIAL_SHOPPING_TRIPS, DEFAULT_SETTINGS } from '../utils/initialData';

export const DEFAULT_LIST_GROUPS: ShoppingListGroup[] = [
  { id: 'list-default', name: 'Minha lista', isDefault: true },
  { id: 'list-feira', name: 'Feira & Hortifruti' },
  { id: 'list-churrasco', name: 'Churrasco com Amigos' },
];

const KEYS = {
  LISTS: 'mercado_app_lists_v1',
  CATEGORIES: 'mercado_app_categories_v1',
  SUPERMARKETS: 'mercado_app_supermarkets_v1',
  ITEMS: 'mercado_app_items_v1',
  TRIPS: 'mercado_app_trips_v1',
  SETTINGS: 'mercado_app_settings_v1',
};

import { IdbStorage } from './idbStorage';
import { getLocalDateKey } from '../utils/helpers';

// Safe JSON parse helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[StorageService] LocalStorage indisponível ou quota excedida para ${key}, usando apenas IndexedDB:`, err);
    // Remove a cópia antiga para ela não "ressuscitar" dados desatualizados no próximo boot;
    // restoreFromIdb() recupera a versão atual do IndexedDB.
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage totalmente indisponível
    }
  }
  // Sincroniza sempre no IndexedDB de forma assíncrona
  IdbStorage.set(key, value).catch(() => {});
}

// Número no formato brasileiro (vírgula decimal) para o Excel/Sheets reconhecer como número
function formatCsvNumber(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

// Neutraliza injeção de fórmula (CWE-1236): células iniciadas por = + - @ viram texto
function sanitizeCsvCell(value: unknown): string {
  let str = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export const StorageService = {
  // Lists
  getLists(): ShoppingListGroup[] {
    const stored = safeGet<ShoppingListGroup[]>(KEYS.LISTS, []);
    if (stored.length === 0) {
      safeSet(KEYS.LISTS, DEFAULT_LIST_GROUPS);
      return DEFAULT_LIST_GROUPS;
    }
    return stored;
  },

  saveLists(lists: ShoppingListGroup[]): void {
    safeSet(KEYS.LISTS, lists);
  },

  // Categories
  getCategories(): Category[] {
    const stored = safeGet<Category[]>(KEYS.CATEGORIES, []);
    if (stored.length === 0) {
      safeSet(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return stored;
  },

  saveCategories(categories: Category[]): void {
    safeSet(KEYS.CATEGORIES, categories);
  },

  // Supermarkets
  getSupermarkets(): Supermarket[] {
    const stored = safeGet<Supermarket[]>(KEYS.SUPERMARKETS, []);
    if (stored.length === 0) {
      safeSet(KEYS.SUPERMARKETS, DEFAULT_SUPERMARKETS);
      return DEFAULT_SUPERMARKETS;
    }
    return stored;
  },

  saveSupermarkets(markets: Supermarket[]): void {
    safeSet(KEYS.SUPERMARKETS, markets);
  },

  // Shopping List Items
  getItems(): ShoppingItem[] {
    const stored = safeGet<ShoppingItem[]>(KEYS.ITEMS, []);
    if (!localStorage.getItem(KEYS.ITEMS)) {
      safeSet(KEYS.ITEMS, INITIAL_SHOPPING_ITEMS);
      return INITIAL_SHOPPING_ITEMS;
    }
    return stored;
  },

  saveItems(items: ShoppingItem[]): void {
    safeSet(KEYS.ITEMS, items);
  },

  // Shopping Trips / Monthly Expense History
  getTrips(): ShoppingTrip[] {
    const stored = safeGet<ShoppingTrip[]>(KEYS.TRIPS, []);
    if (!localStorage.getItem(KEYS.TRIPS)) {
      safeSet(KEYS.TRIPS, INITIAL_SHOPPING_TRIPS);
      return INITIAL_SHOPPING_TRIPS;
    }
    return stored;
  },

  saveTrips(trips: ShoppingTrip[]): void {
    safeSet(KEYS.TRIPS, trips);
  },

  // Settings
  getSettings(): UserSettings {
    const themeMigrated = typeof window !== 'undefined' ? localStorage.getItem('theme_migrated_to_light_v1') : 'true';
    const stored = safeGet<UserSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
    const settings = { ...DEFAULT_SETTINGS, ...stored };

    // Se o usuário ainda não migrou do seed antigo (que continha 'dark' salvo no localStorage)
    if (!themeMigrated) {
      settings.theme = 'light';
      safeSet(KEYS.SETTINGS, settings);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme_migrated_to_light_v1', 'true');
      }
    } else if (!settings.theme || settings.theme === 'system') {
      settings.theme = 'light';
    }
    return settings;
  },

  saveSettings(settings: UserSettings): void {
    safeSet(KEYS.SETTINGS, settings);
  },

  // Reset to default seed
  resetAllData(): void {
    IdbStorage.clear().catch(() => {});
    safeSet(KEYS.LISTS, DEFAULT_LIST_GROUPS);
    safeSet(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    safeSet(KEYS.SUPERMARKETS, DEFAULT_SUPERMARKETS);
    safeSet(KEYS.ITEMS, INITIAL_SHOPPING_ITEMS);
    safeSet(KEYS.TRIPS, INITIAL_SHOPPING_TRIPS);
    safeSet(KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  // Recuperação no boot: se uma chave sumiu do LocalStorage (limpeza do navegador/WebView)
  // mas o IndexedDB ainda tem os dados, copia de volta ANTES de qualquer leitura/seed.
  // Deve ser aguardado antes de montar o React.
  async restoreFromIdb(): Promise<void> {
    for (const key of Object.values(KEYS)) {
      try {
        if (localStorage.getItem(key) !== null) continue;
        const value = await IdbStorage.get<unknown>(key, null);
        if (value !== null && value !== undefined) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // Sem IndexedDB ou localStorage cheio: segue com o que houver
      }
    }
  },

  // Export full JSON Backup
  exportJsonBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      lists: this.getLists(),
      categories: this.getCategories(),
      supermarkets: this.getSupermarkets(),
      items: this.getItems(),
      trips: this.getTrips(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import full JSON Backup
  importJsonBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false;

      // Valida o formato antes de gravar qualquer coisa, para um arquivo inválido não corromper os dados
      const arrayKeys = ['lists', 'categories', 'supermarkets', 'items', 'trips'] as const;
      const hasKnownKey = arrayKeys.some(k => k in data) || 'settings' in data;
      if (!hasKnownKey) return false;
      for (const k of arrayKeys) {
        if (k in data && !Array.isArray(data[k])) return false;
      }
      if ('settings' in data && (typeof data.settings !== 'object' || data.settings === null)) return false;

      if (data.lists?.length) this.saveLists(data.lists);
      if (data.categories) this.saveCategories(data.categories);
      if (data.supermarkets) this.saveSupermarkets(data.supermarkets);
      if (data.items) this.saveItems(data.items);
      if (data.trips) this.saveTrips(data.trips);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  // Export to CSV Spreadsheet (Google Sheets & Excel compatible with UTF-8 BOM)
  exportToCsvSpreadsheet(trips: ShoppingTrip[], currentItems: ShoppingItem[], categories: Category[], supermarkets: Supermarket[]): void {
    const catMap = new Map(categories.map(c => [c.id, c.name]));
    const smMap = new Map(supermarkets.map(s => [s.id, s.name]));

    const rows: string[][] = [
      // Headers
      ['Tipo de Registro', 'Data / Mês', 'Supermercado', 'Categoria', 'Produto', 'Quantidade', 'Unidade', 'Preço Unitário (R$)', 'Total do Item (R$)', 'Status', 'Observações']
    ];

    // Current Shopping List items
    currentItems.forEach(item => {
      const unitPrice = item.actualPrice ?? item.estimatedPrice ?? 0;
      const totalItemPrice = unitPrice > 0 ? formatCsvNumber(unitPrice * item.quantity) : 'Não informado';
      const formattedUnitPrice = unitPrice > 0 ? formatCsvNumber(unitPrice) : 'Não informado';
      const catName = catMap.get(item.categoryId) || 'Geral';
      const smName = item.supermarketId ? (smMap.get(item.supermarketId) || item.supermarketId) : 'Qualquer';

      rows.push([
        'Lista Atual',
        new Date(item.createdAt).toLocaleDateString('pt-BR'),
        smName,
        catName,
        item.name,
        item.quantity.toString(),
        item.unit,
        formattedUnitPrice,
        totalItemPrice,
        item.bought ? 'Comprado' : 'Pendente',
        item.notes || ''
      ]);
    });

    // Historic Trips items
    trips.forEach(trip => {
      const formattedTripDate = new Date(trip.date + 'T12:00:00').toLocaleDateString('pt-BR');
      const tripSmName = trip.supermarketName || (trip.supermarketId ? (smMap.get(trip.supermarketId) || 'Supermercado') : 'Supermercado');

      trip.items.forEach(item => {
        const unitPrice = item.actualPrice ?? item.estimatedPrice ?? 0;
        const totalItemPrice = unitPrice > 0 ? formatCsvNumber(unitPrice * item.quantity) : '0,00';
        const formattedUnitPrice = unitPrice > 0 ? formatCsvNumber(unitPrice) : '0,00';
        const catName = catMap.get(item.categoryId) || 'Geral';

        rows.push([
          `Histórico (${trip.title})`,
          formattedTripDate,
          tripSmName,
          catName,
          item.name,
          item.quantity.toString(),
          item.unit,
          formattedUnitPrice,
          totalItemPrice,
          'Finalizado',
          item.notes || ''
        ]);
      });
    });

    // Convert to CSV with semicolon separator for Brazilian Excel locale
    const csvContent = rows
      .map(row => row.map(sanitizeCsvCell).join(';'))
      .join('\r\n');

    // Add UTF-8 Byte Order Mark (BOM) so Excel opens accents properly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `compras_mensais_${getLocalDateKey()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
