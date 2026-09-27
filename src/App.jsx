// Main App component - orchestrates Dashboard, Inventory, Form, and History
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import InventoryTab from './components/InventoryTab';
import SellModal from './components/SellModal';
import HistoryTab from './components/HistoryTab';
import { useTransactions } from './hooks/useTransactions';
import { getProducts, reduceStock } from './utils/inventoryStorage';
import { Wallet, Sun, Moon, LayoutDashboard, Package, History } from 'lucide-react';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellProduct, setSellProduct] = useState(null);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      setIsDark(JSON.parse(stored));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Apply dark class to html element and persist to localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  const {
    transactions,
    filter,
    setFilter,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    refreshTransactions,
    summary,
  } = useTransactions();

  // Load products
  const loadProducts = useCallback(() => {
    setProducts(getProducts());
  }, []);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handle sell from dashboard or inventory
  const handleSellProduct = (product) => {
    setSellProduct(product);
    setShowSellModal(true);
  };

  // Handle sell completion - reduce stock + create transactions
  const handleSellComplete = (cart, paymentStatus, buyerName) => {
    const now = new Date().toISOString();

    cart.forEach(item => {
      // Reduce stock
      reduceStock(item.productId, item.quantity);

      // Create transaction for each item
      addTransaction({
        type: paymentStatus === 'utang' ? 'pengeluaran' : 'pemasukan',
        amount: item.subtotal,
        category: 'Penjualan Produk',
        note: `${item.name} x${item.quantity}`,
        date: now,
        paymentStatus: paymentStatus,
        buyerName: buyerName,
      });
    });

    // Refresh data
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Wallet size={22} className="text-emerald-600 dark:text-emerald-400" /> Keuangan Usaha</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manajemen penjualan & pengeluaran harian</p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-gray-900 text-white dark:bg-emerald-600'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('inventory')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 relative ${
                currentTab === 'inventory'
                  ? 'bg-gray-900 text-white dark:bg-emerald-600'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Package size={16} /> Inventory
              {products.filter(p => p.stock > 0 && p.stock < 5).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                  {products.filter(p => p.stock > 0 && p.stock < 5).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                currentTab === 'history'
                  ? 'bg-gray-900 text-white dark:bg-emerald-600'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <History size={16} /> History
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentTab === 'dashboard' ? (
          <>
            {/* Dashboard Summary */}
            <Dashboard
              summary={summary}
              products={products}
              onSellProduct={handleSellProduct}
              onViewAllProducts={() => setCurrentTab('inventory')}
            />

            {/* Transaction Form */}
            <TransactionForm onAdd={addTransaction} />

            {/* Transaction History */}
            <TransactionHistory
              transactions={transactions}
              filter={filter}
              onFilterChange={setFilter}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
              onClearAll={clearAllTransactions}
            />
          </>
        ) : currentTab === 'inventory' ? (
          /* Inventory Tab */
          <InventoryTab
            products={products}
            onProductsChange={loadProducts}
            onSellProduct={handleSellProduct}
          />
        ) : (
          /* History Tab */
          <HistoryTab
            onAddTransaction={addTransaction}
            onDeleteTransaction={deleteTransaction}
            onRefreshTransactions={refreshTransactions}
          />
        )}
      </main>

      {/* Sell Modal */}
      <SellModal
        isOpen={showSellModal}
        onClose={() => {
          setShowSellModal(false);
          setSellProduct(null);
        }}
        products={products}
        onSell={handleSellComplete}
        initialProduct={sellProduct}
      />

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-400 dark:text-gray-500">
        MVP | <version>1.1.1</version>
      </footer>
    </div>
  );
};

export default App;
