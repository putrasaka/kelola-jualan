// Transaction Detail Modal - view & edit transaction in a popup
import React, { useState, useEffect } from 'react';
import { X, Pencil, Trash2, TrendingUp, TrendingDown, Receipt, User, Banknote } from 'lucide-react';

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

const kategoriOptions = [
  'Penjualan Produk',
  'Operasional',
  'Bahan Baku',
  'Gaji',
  'Lainnya',
];

const TransactionDetailModal = ({ isOpen, onClose, transaction, onSave, onDelete }) => {
  const [mode, setMode] = useState('view');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen && transaction) {
      setMode('view');
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        note: transaction.note,
        date: new Date(transaction.date).toISOString().slice(0, 16),
        paymentStatus: transaction.paymentStatus || 'cash',
      });
    }
  }, [isOpen, transaction]);

  const handleEdit = () => setMode('edit');
  const handleCancelEdit = () => setMode('view');

  const handleSave = () => {
    onSave(transaction.id, {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Detail Transaksi
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {mode === 'view' ? (
            <div className="space-y-3">
              {/* Type */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'pemasukan' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {transaction.type === 'pemasukan' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {transaction.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nominal</p>
                <p className={`text-xl font-bold ${
                  transaction.type === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatRupiah(transaction.amount)}
                </p>
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-2">
                {transaction.paymentStatus === 'utang' ? (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium rounded-full flex items-center gap-1">
                    <Receipt size={14} /> Utang
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full flex items-center gap-1">
                    <Banknote size={14} /> Cash
                  </span>
                )}
                {transaction.buyerName && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full flex items-center gap-1">
                    <User size={14} /> {transaction.buyerName}
                  </span>
                )}
              </div>

              {/* Note */}
              {transaction.note && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Keterangan</p>
                  <p className="text-gray-900 dark:text-gray-100">{transaction.note}</p>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal</p>
                <p className="text-gray-900 dark:text-gray-100">{formatDate(transaction.date)}</p>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipe</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm">
                  <option value="pemasukan">Pemasukan</option>
                  <option value="pengeluaran">Pengeluaran</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nominal</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm">
                  {kategoriOptions.map(kat => <option key={kat} value={kat}>{kat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Pembayaran</label>
                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm">
                  <option value="cash">Cash</option>
                  <option value="utang">Utang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan</label>
                <input type="text" name="note" value={formData.note} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {mode === 'view' ? (
            <div className="flex gap-3">
              <button onClick={handleEdit} className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Pencil size={16} /> Edit
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleCancelEdit} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                Simpan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
