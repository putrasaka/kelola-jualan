// Transaction Form component - input new transactions
import React, { useState } from 'react';
import { Plus, Banknote, Receipt } from 'lucide-react';

const kategoriOptions = [
  'Penjualan Produk',
  'Operasional',
  'Bahan Baku',
  'Gaji',
  'Lainnya',
];

// Format Date ke YYYY-MM-DDTHH:MM (waktu lokal, bukan UTC)
const formatLocalDatetime = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
};

const TransactionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    type: 'pemasukan',
    amount: '',
    category: 'Penjualan Produk',
    note: '',
    date: formatLocalDatetime(new Date()),
    paymentStatus: 'cash',
  });

  const [isOpen, setIsOpen] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    onAdd({
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      note: formData.note,
      date: new Date(formData.date + ':00').toISOString(),
      paymentStatus: formData.paymentStatus,
    });

    // Reset form
    setFormData({
      type: 'pemasukan',
      amount: '',
      category: 'Penjualan Produk',
      note: '',
      date: formatLocalDatetime(new Date()),
      paymentStatus: 'cash',
    });
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        <span>Tambah Transaksi</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-5 shadow-sm">
          {/* Type Toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipe Transaksi</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'pemasukan' }))}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'pemasukan'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'pengeluaran' }))}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'pengeluaran'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status Pembayaran</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentStatus: 'cash' }))}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.paymentStatus === 'cash'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Banknote size={16} /> Cash
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentStatus: 'utang' }))}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.paymentStatus === 'utang'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Receipt size={16} /> Utang
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nominal (Rp)</label>
<input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            >
              {kategoriOptions.map(kat => (
                <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keterangan</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Catatan singkat..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal & Waktu</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Simpan Transaksi
          </button>
        </form>
      )}
    </div>
  );
};

export default TransactionForm;
