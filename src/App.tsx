import React, { useState } from 'react';
import { ShoppingProvider, useShopping } from './context/ShoppingContext';
import { Header } from './components/Header';
import { ShoppingListView } from './components/ShoppingList/ShoppingListView';
import { PriceComparatorView } from './components/PriceComparator/PriceComparatorView';
import { FinancialDashboardView } from './components/Analytics/FinancialDashboardView';
import { CategorySupermarketView } from './components/Categories/CategorySupermarketView';
import { ItemModal } from './components/ShoppingList/ItemModal';
import { ExportModal } from './components/Export/ExportModal';
import { BottomNavBar } from './components/Navigation/BottomNavBar';
import { UnitPriceCalculatorModal } from './components/Tools/UnitPriceCalculatorModal';
import { InstallPwaPrompt } from './components/PWA/InstallPwaPrompt';
import { ShoppingItem } from './types';

import { ProductCatalogModal } from './components/ShoppingList/ProductCatalogModal';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    categories,
    supermarkets,
    addItem,
    updateItem,
    deleteItem,
    activeListId,
    isCatalogModalOpen,
    setIsCatalogModalOpen,
    itemModalState,
    openItemModal,
    closeItemModal,
  } = useShopping();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white font-sans flex flex-col">
      {/* PWA Install Banner */}
      <InstallPwaPrompt />

      {/* Top Header */}
      <Header
        onOpenAddItem={() => {
          setActiveTab('list');
          setIsCatalogModalOpen(true);
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
        {activeTab === 'list' && <ShoppingListView />}
        {activeTab === 'comparator' && (
          <div className="p-3 sm:p-6">
            <PriceComparatorView />
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="p-3 sm:p-6">
            <FinancialDashboardView />
          </div>
        )}
        {activeTab === 'categories' && (
          <div className="p-3 sm:p-6">
            <CategorySupermarketView />
          </div>
        )}
      </main>

      {/* Mobile Native-Style Bottom Navigation Bar */}
      <BottomNavBar onOpenCalculator={() => setIsCalculatorOpen(true)} />

      {/* Central Product Catalog Modal (Main Flow to Add Items) */}
      <ProductCatalogModal
        isOpen={isCatalogModalOpen}
        categories={categories}
        onClose={() => setIsCatalogModalOpen(false)}
        onAddProducts={(newItems) => {
          newItems.forEach(i => addItem({ ...i, listId: activeListId }));
        }}
        onOpenCustomCreate={(initialName) => {
          setIsCatalogModalOpen(false);
          openItemModal(null, initialName);
        }}
      />

      {/* Item Modal (For Editing or Custom Items Not in Catalog) */}
      <ItemModal
        isOpen={itemModalState.isOpen}
        itemToEdit={itemModalState.itemToEdit}
        initialName={itemModalState.initialName}
        categories={categories}
        supermarkets={supermarkets}
        onClose={closeItemModal}
        onDelete={(id) => {
          deleteItem(id);
          closeItemModal();
        }}
        onSave={(data: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
          if (itemModalState.itemToEdit) {
            updateItem(itemModalState.itemToEdit.id, data);
          } else {
            addItem({ ...data, listId: activeListId });
          }
          closeItemModal();
        }}
      />

      {/* Global Export & Spreadsheet Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Tira-Teima de Preço por Peso / Litro Modal */}
      <UnitPriceCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};


export default function App() {
  return (
    <ShoppingProvider>
      <MainContent />
    </ShoppingProvider>
  );
}
