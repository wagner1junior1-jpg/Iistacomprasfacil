export type UnitType = 'un' | 'kg' | 'g' | 'L' | 'ml' | 'pct' | 'cx' | 'dz' | 'fd' | 'lata';

export interface ShoppingListGroup {
  id: string;
  name: string;
  color?: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  iconName: string;
  isDefault?: boolean;
}

export interface Supermarket {
  id: string;
  name: string;
  color?: string;
  isDefault?: boolean;
}

export interface StorePrice {
  supermarketId: string;
  supermarketName: string;
  price: number;
  lastUpdated: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  unit: UnitType;
  estimatedPrice?: number | null;
  actualPrice?: number | null;
  bought: boolean;
  supermarketId?: string | null;
  notes?: string;
  customImage?: string;
  listId?: string;
  storePrices?: StorePrice[];
  createdAt: string;
  boughtAt?: string | null;
}

export interface ShoppingTrip {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  supermarketId?: string | null;
  supermarketName?: string;
  totalEstimated: number;
  totalSpent: number;
  itemsCount: number;
  items: ShoppingItem[];
  notes?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  defaultSupermarketId?: string;
  monthlyBudgets: Record<string, number>; // "2026-08": 1200
  soundEffects: boolean;
}
