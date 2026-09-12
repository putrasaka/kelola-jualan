// LocalStorage utility for transaction data persistence

const STORAGE_KEY = 'finance_transactions';

// Generate unique ID
export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Get all transactions from LocalStorage
export const getTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
};

// Save all transactions to LocalStorage
export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

// Add a new transaction
export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    paymentStatus: transaction.paymentStatus || 'cash',
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = (id, updates) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
    return transactions[index];
  }
  return null;
};

// Delete a transaction
export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
  return filtered;
};
