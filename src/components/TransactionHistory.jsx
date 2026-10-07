// Transaction History component - table with filters, tap to detail modal
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Receipt, User, Trash2 } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';

const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TransactionHistory = ({ transactions, filter, onFilterChange, onUpdate, onDelete, onClearAll }) => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (tx) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTx(null);
  };

  const handleSave = (id, data) => {
    onUpdate(id, data);
    closeModal();
  };

  const handleDelete = (id) => {
    onDelete(id);
    closeModal();
  };

  const handleClearAll = () => {
    if (window.confirm('Yakin ingin menghapus SEMUA transaksi? Tindakan ini tidak bisa dibatalkan.')) {
      onClearAll();
    }
  };

  const filters = [
    { key: 'all', label: 'Semua' },
    { key: 'today', label: 'Hari Ini' },
    { key: 'income', label: 'Pemasukan' },
    { key: 'expense', label: 'Pengeluaran' },
  ];

  return (
    <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      {/* Filter Tabs */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-gray-900 text-white dark:bg-emerald-600'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
        {transactions.length > 0 && (
          <button
            onClick={handleClearAll}
            title="Hapus semua transaksi"
            className="ml-auto px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors whitespace-nowrap"
          >
            <Trash2 size={14} /> Hapus Semua
          </button>
        )}
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-1">Belum ada transaksi</p>
          <p className="text-sm">Tambahkan transaksi pertama Anda</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {transactions.map(tx => (
            <div
              key={tx.id}
              onClick={() => openModal(tx)}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  tx.type === 'pemasukan' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {tx.type === 'pemasukan' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      tx.paymentStatus === 'utang'
                        ? 'text-yellow-600'
                        : tx.type === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(tx.amount)}
                      {tx.paymentStatus === 'utang' && (<> <Receipt size={14} /></>)}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {tx.category}
                    </span>
                    {tx.paymentStatus === 'utang' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        Utang
                      </span>
                    )}
                    {tx.buyerName && (
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                        <User size={12} /> {tx.buyerName}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {tx.note && <span>{tx.note} • </span>}
                    <span>{formatDate(tx.date)}</span>
                  </div>
                </div>
              </div>

              {/* Desktop/tablet action buttons */}
              <div className="hidden md:flex self-stretch -my-4 -mr-4 ml-3">
                <button
                  onClick={(e) => { e.stopPropagation(); openModal(tx); }}
                  className="px-5 flex items-center text-sm font-medium text-white bg-gray-900 dark:bg-emerald-600 hover:bg-gray-700 dark:hover:bg-emerald-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); if (window.confirm('Yakin ingin menghapus transaksi ini?')) onDelete(tx.id); }}
                  className="px-5 flex items-center text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        transaction={selectedTx}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TransactionHistory;
