// LocalStorage utility for transaction history (cash & utang records)

const HISTORY_KEY = 'finance_history';

// Generate unique ID
const generateId = () => 'hist_' + Date.now().toString(36) + Math.random().toString(36).substr(2);

// Get all history entries
export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

// Save all history entries
const saveHistory = (entries) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Add new history entry
export const addHistoryEntry = (entry) => {
  const all = getHistory();
  const newEntry = {
    ...entry,
    id: generateId(),
    status: entry.status || 'active', // 'active' = belum lunas, 'lunas' = sudah lunas
    createdAt: new Date().toISOString(),
  };
  all.unshift(newEntry);
  saveHistory(all);
  return newEntry;
};

// Update history entry
export const updateHistoryEntry = (id, updates) => {
  const all = getHistory();
  const index = all.findIndex(e => e.id === id);
  if (index !== -1) {
    all[index] = { ...all[index], ...updates };
    saveHistory(all);
    return all[index];
  }
  return null;
};

// Delete history entry
export const deleteHistoryEntry = (id) => {
  const all = getHistory();
  const filtered = all.filter(e => e.id !== id);
  saveHistory(filtered);
  return filtered;
};

// Clear all history
export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// Get cash entries (type=cash only)
export const getCashHistory = () => {
  return getHistory().filter(e => e.type === 'cash');
};

// Get utang entries (type=utang AND status=active)
export const getUtangHistory = () => {
  return getHistory().filter(e => e.type === 'utang' && e.status === 'active');
};
