import { useState, useEffect, useCallback } from 'react';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction, clearTransactions } from '../utils/storage';

// Custom hook for managing transaction state with LocalStorage
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  // Load transactions on mount
  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  // Refresh transactions from localStorage
  const refreshTransactions = useCallback(() => {
    setTransactions(getTransactions());
  }, []);

  // Add new transaction
  const handleAdd = useCallback((data) => {
    const newTx = addTransaction(data);
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  // Update existing transaction
  const handleUpdate = useCallback((id, data) => {
    const updated = updateTransaction(id, data);
    if (updated) {
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
    }
  }, []);

  // Delete transaction
  const handleDelete = useCallback((id) => {
    deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  // Clear all transactions
  const handleClearAll = useCallback(() => {
    clearTransactions();
    setTransactions([]);
  }, []);

  // Filter transactions based on current filter
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(t.date).toDateString() === today;
    }
    if (filter === 'income') return t.type === 'pemasukan';
    if (filter === 'expense') return t.type === 'pengeluaran';
    return true;
  });

  // Calculate daily summary
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(t => new Date(t.date).toDateString() === today);

  const summary = {
    totalIncome: todayTransactions
      .filter(t => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: todayTransactions
      .filter(t => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0),
  };
  summary.profit = summary.totalIncome - summary.totalExpense;

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    filter,
    setFilter,
    addTransaction: handleAdd,
    updateTransaction: handleUpdate,
    deleteTransaction: handleDelete,
    clearAllTransactions: handleClearAll,
    refreshTransactions,
    summary,
  };
};
