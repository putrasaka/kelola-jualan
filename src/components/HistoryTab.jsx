// History Tab component - displays cash & utang transaction history side by side
import React, { useState } from 'react';
import { User, Banknote, Receipt, StickyNote, Clock, CircleCheck, Trash2, History } from 'lucide-react';
import { getCashHistory, getUtangHistory, deleteHistoryEntry, clearHistory } from '../utils/historyStorage';

// Format number to Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to local string
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const HistoryTab = ({ onAddTransaction, onDeleteTransaction, onRefreshTransactions }) => {
  const [cashHistory, setCashHistory] = useState(getCashHistory());
  const [utangHistory, setUtangHistory] = useState(getUtangHistory());
  const [message, setMessage] = useState(null);

  // Show temporary message
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Refresh histories
  const refreshHistories = () => {
    setCashHistory(getCashHistory());
    setUtangHistory(getUtangHistory());
  };

  // Handle lunasi (pay off utang)
  const handleLunasi = (entry) => {
    // 1. Add pemasukan transaction to dashboard via hook (auto-saves to history)
    onAddTransaction({
      type: 'pemasukan',
      amount: entry.amount,
      category: 'Penjualan Produk',
      note: `Utang lunas atas nama ${entry.buyerName}`,
      date: new Date().toISOString(),
      paymentStatus: 'cash',
      buyerName: entry.buyerName,
    });

    // 2. Delete original utang entry from history
    deleteHistoryEntry(entry.id);

    // 3. Delete original utang transaction from finance_transactions
    if (entry.transactionId && onDeleteTransaction) {
      onDeleteTransaction(entry.transactionId);
    }

    // 4. Refresh transactions in dashboard
    if (onRefreshTransactions) {
      onRefreshTransactions();
    }

    // Refresh histories
    refreshHistories();
    showMessage(`Utang ${entry.buyerName} berhasil dilunasi!`);
  };

  // Handle delete single entry
  const handleDeleteEntry = (id) => {
    if (window.confirm('Yakin ingin menghapus history ini?')) {
      deleteHistoryEntry(id);
      refreshHistories();
      showMessage('History berhasil dihapus!');
    }
  };

  // Handle delete all
  const handleDeleteAll = () => {
    if (window.confirm('Yakin ingin menghapus SEMUA history transaksi?')) {
      clearHistory();
      refreshHistories();
      showMessage('Semua history berhasil dihapus!');
    }
  };

  // Render a single history entry
  const renderEntry = (entry, showLunasi = false) => (
    <div
      key={entry.id}
      className={`p-4 rounded-xl border transition-all hover:shadow-sm ${
        entry.type === 'cash' || entry.status === 'lunas'
          ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
          : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Buyer Name */}
          <div className="flex items-center gap-2 mb-1">
            <User size={20} className="shrink-0" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {entry.buyerName}
            </span>
            {entry.note === 'Utang lunas' && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                <Banknote size={12} /> Utang lunas
              </span>
            )}
          </div>

          {/* Amount */}
          <p className={`text-lg font-bold ${
            entry.type === 'cash' || entry.status === 'lunas'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-yellow-600 dark:text-yellow-400'
          }`}>
            {formatRupiah(entry.amount)}
          </p>

          {/* Note */}
          {entry.note && entry.note !== 'Utang lunas' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <StickyNote size={14} /> {entry.note}
            </p>
          )}

          {/* Date */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            <Clock size={12} /> {formatDate(entry.date)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-3">
          {/* Lunasi Button (only for active utang) */}
          {showLunasi && entry.status === 'active' && (
            <button
              onClick={() => handleLunasi(entry)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
            >
              <CircleCheck size={16} /> Lunasi
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteEntry(entry.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Hapus"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <History size={22} /> History Transaksi
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Data transaksi setelah dikirim dari dashboard
          </p>
        </div>
        {(cashHistory.length > 0 || utangHistory.length > 0) && (
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            <Trash2 size={14} /> Hapus Semua
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'error'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Two Frames Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cash Frame */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <Banknote size={18} /> Transaksi Cash
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                {cashHistory.length}
              </span>
            </h3>
          </div>
          <div className="p-3 max-h-[60vh] overflow-y-auto">
            {cashHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-lg mb-1">Belum ada transaksi cash</p>
                <p className="text-sm">Kirim data dari dashboard untuk melihat history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cashHistory.map(entry => renderEntry(entry, false))}
              </div>
            )}
          </div>
        </div>

        {/* Utang Frame */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
              <Receipt size={18} /> Transaksi Utang
              <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
                {utangHistory.length}
              </span>
            </h3>
          </div>
          <div className="p-3 max-h-[60vh] overflow-y-auto">
            {utangHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-lg mb-1">Tidak ada utang aktif</p>
                <p className="text-sm">Semua utang sudah lunas atau belum ada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {utangHistory.map(entry => renderEntry(entry, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
