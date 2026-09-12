// LocalStorage utility for chart data (daily financial summaries)

const CHART_STORAGE_KEY = 'finance_chart_data';

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Get all chart data
export const getChartData = () => {
  try {
    const data = localStorage.getItem(CHART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading chart data:', error);
    return [];
  }
};

// Save all chart data
const saveChartData = (data) => {
  try {
    localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving chart data:', error);
  }
};

// Add new chart data entry
export const addChartData = (entry) => {
  const allData = getChartData();
  const newEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  allData.push(newEntry);
  // Sort by date ascending
  allData.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveChartData(allData);
  return newEntry;
};

// Update chart data entry
export const updateChartData = (id, updates) => {
  const allData = getChartData();
  const index = allData.findIndex(d => d.id === id);
  if (index !== -1) {
    allData[index] = { ...allData[index], ...updates };
    saveChartData(allData);
    return allData[index];
  }
  return null;
};

// Delete chart data entry
export const deleteChartData = (id) => {
  const allData = getChartData();
  const filtered = allData.filter(d => d.id !== id);
  saveChartData(filtered);
  return filtered;
};

// Check if chart data exists for a specific date (YYYY-MM-DD)
export const getChartDataByDate = (dateStr) => {
  const allData = getChartData();
  return allData.find(d => d.date === dateStr) || null;
};
