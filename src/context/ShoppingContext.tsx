import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Category, Supermarket, ShoppingItem, ShoppingTrip, UserSettings, StorePrice, ShoppingListGroup } from '../types';
import { StorageService } from '../services/storage';
import { getMonthKey, getLocalDateKey } from '../utils/helpers';

interface ShoppingContextType {
  // State
  lists: ShoppingListGroup[];
  activeListId: string;
  items: ShoppingItem[];
  categories: Category[];
  supermarkets: Supermarket[];
  trips: ShoppingTrip[];
  settings: UserSettings;
  activeTab: 'list' | 'comparator' | 'analytics' | 'categories';
  searchQuery: string;
  selectedCategoryId: string | 'all';
  selectedStatus: 'all' | 'pending' | 'bought';

  // State setters
  setActiveListId: (listId: string) => void;
  addList: (name: string) => ShoppingListGroup;
  deleteList: (listId: string) => void;
  renameList: (listId: string, name: string) => void;
  setActiveTab: (tab: 'list' | 'comparator' | 'analytics' | 'categories') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (catId: string | 'all') => void;
  setSelectedStatus: (status: 'all' | 'pending' | 'bought') => void;

  // Item Actions
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => ShoppingItem;
  updateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemBought: (id: string) => void;
  clearBoughtItems: () => void;
  clearAllItems: () => void;
  markAllBought: () => void;
  unmarkAllBought: () => void;
  updateItemPriceForStore: (itemId: string, supermarketId: string, supermarketName: string, price: number) => void;

  // Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Supermarket Actions
  addSupermarket: (sm: Omit<Supermarket, 'id'>) => Supermarket;
  updateSupermarket: (id: string, updates: Partial<Supermarket>) => void;
  deleteSupermarket: (id: string) => void;

  // Trip / Financial History Actions
  finishShoppingTrip: (tripData: {
    title: string;
    supermarketId?: string | null;
    supermarketName?: string;
    totalSpent?: number;
    notes?: string;
    archiveBoughtItemsOnly?: boolean;
  }) => ShoppingTrip;
  deleteTrip: (id: string) => void;

  // Settings Actions
  updateSettings: (updates: Partial<UserSettings>) => void;
  setMonthlyBudget: (month: string, amount: number) => void;
  toggleTheme: () => void;
  
  // Data management
  resetData: () => void;
  resetToFreshStart: () => void;
  exportCsv: () => void;
  exportBackupJson: () => string;
  importBackupJson: (json: string) => boolean;

  // Global Modals
  isCatalogModalOpen: boolean;
  setIsCatalogModalOpen: (open: boolean) => void;
  itemModalState: { isOpen: boolean; itemToEdit: ShoppingItem | null; initialName: string };
  openItemModal: (itemToEdit?: ShoppingItem | null, initialName?: string) => void;
  closeItemModal: () => void;
  hasUsedInitialReset: boolean;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingListGroup[]>(() => StorageService.getLists());
  const [activeListId, setActiveListId] = useState<string>(() => {
    const stored = StorageService.getLists();
    return stored[0]?.id || 'list-default';
  });
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>(() => StorageService.getSupermarkets());
  const [items, setItems] = useState<ShoppingItem[]>(() => StorageService.getItems());
  const [trips, setTrips] = useState<ShoppingTrip[]>(() => StorageService.getTrips());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());

  const [activeTab, setActiveTab] = useState<'list' | 'comparator' | 'analytics' | 'categories'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'bought'>('all');

  // Global modal state
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [itemModalState, setItemModalState] = useState<{
    isOpen: boolean;
    itemToEdit: ShoppingItem | null;
    initialName: string;
  }>({
    isOpen: false,
    itemToEdit: null,
    initialName: '',
  });

  const openItemModal = (itemToEdit: ShoppingItem | null = null, initialName = '') => {
    setItemModalState({
      isOpen: true,
      itemToEdit,
      initialName,
    });
  };

  const closeItemModal = () => {
    setItemModalState({
      isOpen: false,
      itemToEdit: null,
      initialName: '',
    });
  };

  // One-time initial reset button state
  const [hasUsedInitialReset, setHasUsedInitialReset] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('mercadofacil_initial_reset_used') === 'true';
  });

  // Sync to LocalStorage on changes
  useEffect(() => {
    StorageService.saveLists(lists);
  }, [lists]);
  useEffect(() => {
    StorageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    StorageService.saveSupermarkets(supermarkets);
  }, [supermarkets]);

  useEffect(() => {
    StorageService.saveItems(items);
  }, [items]);

  useEffect(() => {
    StorageService.saveTrips(trips);
  }, [trips]);

  useEffect(() => {
    StorageService.saveSettings(settings);
    // Theme effect: default is light
    const root = document.documentElement;
    const isDark = settings.theme === 'dark';

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  // Audio feedback helper (tactile feedback simulation)
  const playHapticBeep = () => {
    if (!settings.soundEffects) return;
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // List operations
  const addList = (name: string): ShoppingListGroup => {
    const newList: ShoppingListGroup = {
      id: `list-${Date.now()}`,
      name: name.trim() || 'Nova Lista',
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    return newList;
  };

  const deleteList = (listId: string) => {
    if (lists.length <= 1) return; // Keep at least one list
    setLists(prev => prev.filter(l => l.id !== listId));
    setItems(prev => prev.filter(i => i.listId !== listId));
    if (activeListId === listId) {
      const remaining = lists.filter(l => l.id !== listId);
      setActiveListId(remaining[0]?.id || 'list-default');
    }
  };

  const renameList = (listId: string, name: string) => {
    setLists(prev => prev.map(l => (l.id === listId ? { ...l, name: name.trim() } : l)));
  };

  // Item operations
  const addItem = (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>): ShoppingItem => {
    const newItem: ShoppingItem = {
      ...itemData,
      listId: itemData.listId || activeListId,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<ShoppingItem>) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemBought = (id: string) => {
    playHapticBeep();
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newBought = !item.bought;
          return {
            ...item,
            bought: newBought,
            boughtAt: newBought ? new Date().toISOString() : null,
          };
        }
        return item;
      })
    );
  };

  const markAllBought = () => {
    setItems(prev =>
      prev.map(item => {
        if (!item.listId || item.listId === activeListId) {
          return { ...item, bought: true, boughtAt: new Date().toISOString() };
        }
        return item;
      })
    );
  };

  const unmarkAllBought = () => {
    setItems(prev =>
      prev.map(item => {
        if (!item.listId || item.listId === activeListId) {
          return { ...item, bought: false, boughtAt: null };
        }
        return item;
      })
    );
  };

  const clearBoughtItems = () => {
    setItems(prev => prev.filter(item => !(item.bought && (!item.listId || item.listId === activeListId))));
  };

  const clearAllItems = () => {
    setItems(prev => prev.filter(item => item.listId && item.listId !== activeListId));
  };

  const updateItemPriceForStore = (
    itemId: string,
    supermarketId: string,
    supermarketName: string,
    price: number
  ) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const existingPrices = item.storePrices ? [...item.storePrices] : [];
          const idx = existingPrices.findIndex(sp => sp.supermarketId === supermarketId);
          const newPriceObj: StorePrice = {
            supermarketId,
            supermarketName,
            price,
            lastUpdated: getLocalDateKey(),
          };

          if (idx >= 0) {
            existingPrices[idx] = newPriceObj;
          } else {
            existingPrices.push(newPriceObj);
          }

          return {
            ...item,
            storePrices: existingPrices,
          };
        }
        return item;
      })
    );
  };

  // Category operations
  const addCategory = (catData: Omit<Category, 'id'>): Category => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    // Reassign items to "outros" or first available
    const fallback = categories.find(c => c.id !== id)?.id || 'cat-outros';
    setItems(prev =>
      prev.map(item => (item.categoryId === id ? { ...item, categoryId: fallback } : item))
    );
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Supermarket operations
  const addSupermarket = (smData: Omit<Supermarket, 'id'>): Supermarket => {
    const newSm: Supermarket = {
      ...smData,
      id: `sm-${Date.now()}`,
    };
    setSupermarkets(prev => [...prev, newSm]);
    return newSm;
  };

  const updateSupermarket = (id: string, updates: Partial<Supermarket>) => {
    setSupermarkets(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSupermarket = (id: string) => {
    setSupermarkets(prev => prev.filter(s => s.id !== id));
  };

  // Finish shopping session / trip
  const finishShoppingTrip = ({
    title,
    supermarketId,
    supermarketName,
    totalSpent: customTotalSpent,
    notes,
    archiveBoughtItemsOnly = true,
  }: {
    title: string;
    supermarketId?: string | null;
    supermarketName?: string;
    totalSpent?: number;
    notes?: string;
    archiveBoughtItemsOnly?: boolean;
  }): ShoppingTrip => {
    const isInActiveList = (i: ShoppingItem) => !i.listId || i.listId === activeListId;
    const boughtItems = items.filter(i => isInActiveList(i) && (archiveBoughtItemsOnly ? i.bought : true));
    
    // Auto calculate if not passed
    let calculatedSpent = 0;
    let calculatedEstimated = 0;
    boughtItems.forEach(i => {
      const price = i.actualPrice ?? i.estimatedPrice ?? 0;
      calculatedSpent += price * i.quantity;
      calculatedEstimated += (i.estimatedPrice ?? i.actualPrice ?? 0) * i.quantity;
    });

    const finalTotalSpent = customTotalSpent !== undefined && customTotalSpent !== null ? customTotalSpent : calculatedSpent;
    const today = new Date();
    const dateStr = getLocalDateKey(today);
    const monthStr = getMonthKey(today);

    const smFound = supermarkets.find(s => s.id === supermarketId);
    const resolvedSmName = supermarketName || smFound?.name || 'Supermercado';

    const newTrip: ShoppingTrip = {
      id: `trip-${Date.now()}`,
      title: title || `Compra ${resolvedSmName} - ${today.toLocaleDateString('pt-BR')}`,
      date: dateStr,
      month: monthStr,
      supermarketId,
      supermarketName: resolvedSmName,
      totalEstimated: calculatedEstimated,
      totalSpent: finalTotalSpent,
      itemsCount: boughtItems.length,
      items: boughtItems,
      notes,
    };

    // Save trip
    setTrips(prev => [newTrip, ...prev]);

    // Archive or remove bought items from active list
    // Only touch the active list; items from other lists are preserved
    if (archiveBoughtItemsOnly) {
      setItems(prev => prev.filter(i => !(isInActiveList(i) && i.bought)));
    } else {
      setItems(prev => prev.filter(i => !isInActiveList(i)));
    }

    return newTrip;
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const setMonthlyBudget = (month: string, amount: number) => {
    setSettings(prev => ({
      ...prev,
      monthlyBudgets: {
        ...prev.monthlyBudgets,
        [month]: amount,
      },
    }));
  };

  const toggleTheme = () => {
    setSettings(prev => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  };

  // Reload lists from storage and keep the active list valid
  const syncListsFromStorage = () => {
    const storedLists = StorageService.getLists();
    setLists(storedLists);
    setActiveListId(prev => (storedLists.some(l => l.id === prev) ? prev : storedLists[0]?.id || 'list-default'));
  };

  // Export & Backups
  const resetData = () => {
    StorageService.resetAllData();
    syncListsFromStorage();
    setCategories(StorageService.getCategories());
    setSupermarkets(StorageService.getSupermarkets());
    setItems(StorageService.getItems());
    setTrips(StorageService.getTrips());
    setSettings(StorageService.getSettings());
  };

  const resetToFreshStart = () => {
    const freshSupermarkets: Supermarket[] = [
      { id: 'sm-1', name: 'Mercado 1', isDefault: true }
    ];
    setItems([]);
    setSupermarkets(freshSupermarkets);
    setTrips([]);
    StorageService.saveItems([]);
    StorageService.saveSupermarkets(freshSupermarkets);
    StorageService.saveTrips([]);

    setHasUsedInitialReset(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mercadofacil_initial_reset_used', 'true');
    }
  };

  const exportCsv = () => {
    StorageService.exportToCsvSpreadsheet(trips, items, categories, supermarkets);
  };

  const exportBackupJson = () => {
    return StorageService.exportJsonBackup();
  };

  const importBackupJson = (json: string): boolean => {
    const success = StorageService.importJsonBackup(json);
    if (success) {
      syncListsFromStorage();
      setCategories(StorageService.getCategories());
      setSupermarkets(StorageService.getSupermarkets());
      setItems(StorageService.getItems());
      setTrips(StorageService.getTrips());
      setSettings(StorageService.getSettings());
    }
    return success;
  };

  return (
    <ShoppingContext.Provider
      value={{
        lists,
        activeListId,
        items,
        categories,
        supermarkets,
        trips,
        settings,
        activeTab,
        searchQuery,
        selectedCategoryId,
        selectedStatus,
        setActiveListId,
        addList,
        deleteList,
        renameList,
        setActiveTab,
        setSearchQuery,
        setSelectedCategoryId,
        setSelectedStatus,
        addItem,
        updateItem,
        deleteItem,
        toggleItemBought,
        clearBoughtItems,
        clearAllItems,
        markAllBought,
        unmarkAllBought,
        updateItemPriceForStore,
        addCategory,
        updateCategory,
        deleteCategory,
        addSupermarket,
        updateSupermarket,
        deleteSupermarket,
        finishShoppingTrip,
        deleteTrip,
        updateSettings,
        setMonthlyBudget,
        toggleTheme,
        resetData,
        resetToFreshStart,
        exportCsv,
        exportBackupJson,
        importBackupJson,
        isCatalogModalOpen,
        setIsCatalogModalOpen,
        itemModalState,
        openItemModal,
        closeItemModal,
        hasUsedInitialReset,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
