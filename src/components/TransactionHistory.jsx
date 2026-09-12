// Transaction History component - table with filters, edit, delete
import React, { useState } from 'react';

// Format number to Indonesian Rupiah
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

const kategoriOptions = [
  'Penjualan Produk',
  'Operasional',
  'Bahan Baku',
  'Gaji',
  'Lainnya',
];

const TransactionHistory = ({ transactions, filter, onFilterChange, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Start editing a transaction
  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setEditData({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      note: tx.note,
      date: new Date(tx.date).toISOString().slice(0, 16),
      paymentStatus: tx.paymentStatus || 'cash',
    });
  };

  // Save edited transaction
  const handleSave = () => {
    onUpdate(editingId, {
      ...editData,
      amount: parseFloat(editData.amount),
      date: new Date(editData.date).toISOString(),
    });
    setEditingId(null);
    setEditData({});
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
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
      <div className="flex border-b border-gray-200 overflow-x-auto">
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
            <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              {editingId === tx.id ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      name="type"
                      value={editData.type}
                      onChange={handleEditChange}
                      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    >
                      <option value="pemasukan">Pemasukan</option>
                      <option value="pengeluaran">Pengeluaran</option>
                    </select>
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleEditChange}
                      className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      name="category"
                      value={editData.category}
                      onChange={handleEditChange}
                      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    >
                      {kategoriOptions.map(kat => (
                        <option key={kat} value={kat}>{kat}</option>
                      ))}
                    </select>
                    <select
                      name="paymentStatus"
                      value={editData.paymentStatus || 'cash'}
                      onChange={handleEditChange}
                      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="utang">🧾 Utang</option>
                    </select>
                    <input
                      type="text"
                      name="note"
                      value={editData.note}
                      onChange={handleEditChange}
                      placeholder="Keterangan..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                      className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                    <button
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      tx.type === 'pemasukan' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {tx.type === 'pemasukan' ? '📈' : '📉'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          tx.paymentStatus === 'utang'
                            ? 'text-yellow-600'
                            : tx.type === 'pemasukan' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(tx.amount)}
                          {tx.paymentStatus === 'utang' && ' 🧾'}
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
                            👤 {tx.buyerName}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {tx.note && <span>{tx.note} • </span>}
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(tx)}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(tx.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
