// LocalStorage utility for inventory/products

const INVENTORY_KEY = 'inventory_products';

// Generate unique ID
const generateId = () => 'prod_' + Date.now().toString(36) + Math.random().toString(36).substr(2);

// Get all products
export const getProducts = () => {
  try {
    const data = localStorage.getItem(INVENTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Save all products
const saveProducts = (products) => {
  try {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// Get product by ID
export const getProductById = (id) => {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
};

// Add new product
export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

// Update product
export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    saveProducts(products);
    return products[index];
  }
  return null;
};

// Delete product
export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return filtered;
};

// Reduce stock for a product
export const reduceStock = (id, quantity) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index].stock = Math.max(0, products[index].stock - quantity);
    products[index].updatedAt = new Date().toISOString();
    saveProducts(products);
    return products[index];
  }
  return null;
};

// Get products with low stock (below threshold)
export const getLowStockProducts = (threshold = 5) => {
  const products = getProducts();
  return products.filter(p => p.stock > 0 && p.stock < threshold);
};

// Get out of stock products
export const getOutOfStockProducts = () => {
  const products = getProducts();
  return products.filter(p => p.stock === 0);
};
