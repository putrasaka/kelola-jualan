// Data Management component - send data, edit, delete chart entries
import React, { useState } from 'react';
import { getChartData, addChartData, updateChartData, deleteChartData } from '../utils/chartStorage';
import { calculateDailySummary, calculateProfits, formatRupiah, formatDateLabel } from '../utils/chartHelpers';
import { addHistoryEntry } from '../utils/historyStorage';

const DataManagement = ({ allTransactions, chartData, onChartUpdate, onTransactionsCleared }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState(null);

  // Show temporary message
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Send today's transactions to chart data + history
  const handleSendToday = () => {
    if (allTransactions.length === 0) {
      showMessage('Tidak ada transaksi untuk dikirim', 'error');
      return;
    }

    // 1. Save all transactions to history
    allTransactions.forEach(tx => {
      addHistoryEntry({
        buyerName: tx.buyerName || '-',
        amount: tx.amount,
        type: tx.paymentStatus === 'utang' ? 'utang' : 'cash',
        date: tx.date,
        category: tx.category,
        note: tx.note || '',
        status: 'active',
      });
    });

    // 2. Save to chart data (keep existing logic)
    const today = new Date().toISOString().slice(0, 10);
    const todayTransactions = allTransactions.filter(tx => {
      const txDate = new Date(tx.date).toISOString().slice(0, 10);
      return txDate === today;
    });

    if (todayTransactions.length > 0) {
      const existing = chartData.find(d => d.date === today);
      const summary = calculateDailySummary(todayTransactions);
      const profits = calculateProfits(summary);

      const entryData = {
        date: today,
        pemasukkan: summary.pemasukkan,
        pengeluaran: summary.pengeluaran,
        utang: summary.utang,
        labaKotor: profits.labaKotor,
        labaBersih: profits.labaBersih,
      };

      if (existing) {
        updateChartData(existing.id, entryData);
      } else {
        addChartData(entryData);
      }
    }

    // 3. Clear transaction table
    if (onTransactionsCleared) onTransactionsCleared();
    onChartUpdate();
    showMessage(`${allTransactions.length} transaksi berhasil dikirim ke history!`);
  };

  // Start editing
  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditData({
      pemasukkan: entry.pemasukkan,
      pengeluaran: entry.pengeluaran,
      utang: entry.utang,
    });
  };

  // Save edit
  const handleSave = () => {
    const pemasukkan = parseFloat(editData.pemasukkan) || 0;
    const pengeluaran = parseFloat(editData.pengeluaran) || 0;
    const utang = parseFloat(editData.utang) || 0;
    const labaKotor = utang + pemasukkan;
    const labaBersih = pemasukkan - (utang + pengeluaran);

    updateChartData(editingId, {
      pemasukkan,
      pengeluaran,
      utang,
      labaKotor,
      labaBersih,
    });

    setEditingId(null);
    setEditData({});
    onChartUpdate();
    showMessage('Data berhasil diupdate!');
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  // Delete entry
  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      deleteChartData(id);
      onChartUpdate();
      showMessage('Data berhasil dihapus!');
    }
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          📤 Kirim Data Keuangan
        </h3>
        <button
          onClick={handleSendToday}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Kirim Data Hari Ini
        </button>
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

      {/* Chart Data Table */}
      {chartData.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Belum ada data chart. Kirim data pertama Anda!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Tanggal</th>
                <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Pemasukkan</th>
                <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Pengeluaran</th>
                <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Utang</th>
                <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Laba Kotor</th>
                <th className="text-right py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Laba Bersih</th>
                <th className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  {editingId === entry.id ? (
                    // Edit Mode
                    <>
                      <td className="py-3 px-2 text-gray-900 dark:text-gray-100">
                        {formatDateLabel(entry.date)}
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          name="pemasukkan"
                          value={editData.pemasukkan}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-2 py-1 text-right text-sm"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          name="pengeluaran"
                          value={editData.pengeluaran}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-2 py-1 text-right text-sm"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          name="utang"
                          value={editData.utang}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-2 py-1 text-right text-sm"
                        />
                      </td>
                      <td className="py-3 px-2 text-right text-gray-500 dark:text-gray-400" colSpan={2}>
                        <span className="text-xs">Auto-hitung</span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={handleSave}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-xs font-medium"
                          >
                            Batal
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">
                        {formatDateLabel(entry.date)}
                      </td>
                      <td className="py-3 px-2 text-right text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(entry.pemasukkan)}
                      </td>
                      <td className="py-3 px-2 text-right text-red-600 dark:text-red-400">
                        {formatRupiah(entry.pengeluaran)}
                      </td>
                      <td className="py-3 px-2 text-right text-yellow-600 dark:text-yellow-400">
                        {formatRupiah(entry.utang)}
                      </td>
                      <td className="py-3 px-2 text-right text-blue-600 dark:text-blue-400">
                        {formatRupiah(entry.labaKotor)}
                      </td>
                      <td className="py-3 px-2 text-right text-amber-600 dark:text-amber-400">
                        {formatRupiah(entry.labaBersih)}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
