// Dashboard component - displays daily summary cards and product stock overview
import React from 'react';
import ProductCard from './ProductCard';
import { TrendingUp, TrendingDown, Coins, TriangleAlert, Package } from 'lucide-react';

// Format number to Indonesian Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard = ({ summary, products, onSellProduct, onViewAllProducts }) => {
  const cards = [
    {
      title: 'Total Pemasukan',
      value: summary.totalIncome,
      color: 'text-emerald-400 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: <TrendingUp size={28} />,
    },
    {
      title: 'Total Pengeluaran',
      value: summary.totalExpense,
      color: 'text-red-400 dark:text-red-300',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: <TrendingDown size={28} />,
    },
    {
      title: 'Total Profit',
      value: summary.profit,
      color: summary.profit >= 0 ? 'text-emerald-400 dark:text-emerald-300' : 'text-red-400 dark:text-red-300',
      bg: summary.profit >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20',
      border: summary.profit >= 0 ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800',
      icon: summary.profit >= 0 ? <Coins size={28} /> : <TriangleAlert size={28} />,
    },
  ];

  // Get products ready to sell (stock > 0), show max 6
  const readyProducts = products
    .filter(p => p.stock > 0)
    .slice(0, 6);

  // Low stock warning products
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 5);

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} ${card.border} border rounded-xl p-5 transition-all hover:shadow-md dark:hover:shadow-emerald-900/10`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</span>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              {formatRupiah(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Product Stock Section */}
      {products.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Package size={20} /> Stok Ready
            </h2>
            {products.length > 6 && (
              <button
                onClick={onViewAllProducts}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Lihat Semua →
              </button>
            )}
          </div>

          {/* Low Stock Warning */}
          {lowStockProducts.length > 0 && (
            <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <TriangleAlert size={14} /> <strong>{lowStockProducts.length} produk</strong> stok hampir habis:{' '}
                {lowStockProducts.map(p => p.name).join(', ')}
              </p>
            </div>
          )}

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {readyProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                compact={true}
                onSell={() => onSellProduct(product)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
