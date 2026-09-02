import React from 'react';
import {
  Apple,
  Beef,
  Wheat,
  Milk,
  Coffee,
  Sparkles,
  Heart,
  Croissant,
  IceCream,
  ShoppingBag,
  Carrot,
  Fish,
  Utensils,
  Wine,
  Package,
  Layers,
  Baby,
  Dog,
  Zap,
  Tag,
  CircleDollarSign,
  Store
} from 'lucide-react';

export const ICON_OPTIONS: { name: string; label: string; icon: React.FC<{ className?: string }> }[] = [
  { name: 'Apple', label: 'Hortifruti / Maçã', icon: Apple },
  { name: 'Carrot', label: 'Legumes / Cenoura', icon: Carrot },
  { name: 'Beef', label: 'Carnes', icon: Beef },
  { name: 'Fish', label: 'Peixes & Frutos do Mar', icon: Fish },
  { name: 'Wheat', label: 'Mercearia / Grãos', icon: Wheat },
  { name: 'Milk', label: 'Laticínios', icon: Milk },
  { name: 'Coffee', label: 'Bebidas & Café', icon: Coffee },
  { name: 'Wine', label: 'Bebidas Alcoólicas', icon: Wine },
  { name: 'Sparkles', label: 'Limpeza', icon: Sparkles },
  { name: 'Heart', label: 'Higiene & Cuidados', icon: Heart },
  { name: 'Croissant', label: 'Padaria', icon: Croissant },
  { name: 'IceCream', label: 'Congelados & Sobremesas', icon: IceCream },
  { name: 'Utensils', label: 'Alimentação / Pronto', icon: Utensils },
  { name: 'Dog', label: 'Pet Shop', icon: Dog },
  { name: 'Baby', label: 'Bebê / Infantil', icon: Baby },
  { name: 'Zap', label: 'Eletrônicos / Bazar', icon: Zap },
  { name: 'Package', label: 'Despensa / Caixas', icon: Package },
  { name: 'Tag', label: 'Promoção / Ofertas', icon: Tag },
  { name: 'ShoppingBag', label: 'Geral / Outros', icon: ShoppingBag },
  { name: 'Store', label: 'Mercado', icon: Store },
];

export function getCategoryIcon(iconName: string, className = "w-4 h-4"): React.ReactElement {
  const found = ICON_OPTIONS.find(item => item.name === iconName);
  if (found) {
    const IconComponent = found.icon;
    return <IconComponent className={className} />;
  }
  return <ShoppingBag className={className} />;
}

export const COLOR_PALETTE = [
  { name: 'Verde Esmeralda', hex: '#16a34a' },
  { name: 'Vermelho Intenso', hex: '#dc2626' },
  { name: 'Âmbar Dourado', hex: '#d97706' },
  { name: 'Azul Real', hex: '#2563eb' },
  { name: 'Roxo Violeta', hex: '#7c3aed' },
  { name: 'Ciano Limpeza', hex: '#0891b2' },
  { name: 'Rosa Vibrante', hex: '#db2777' },
  { name: 'Laranja Quente', hex: '#ea580c' },
  { name: 'Índigo Noite', hex: '#4f46e5' },
  { name: 'Teal Moderno', hex: '#0d9488' },
  { name: 'Cinza Ardósia', hex: '#64748b' },
  { name: 'Rosa Coral', hex: '#f43f5e' },
];
