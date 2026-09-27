// Inventory Tab component - main inventory management view
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';
import { addProduct, updateProduct, deleteProduct } from '../utils/inventoryStorage';
import { Package } from 'lucide-react';

const InventoryTab = ({ products, onProductsChange, onSellProduct }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState(null);

  // Show temporary message
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle add new product
  const handleAddProduct = (data) => {
    addProduct(data);
    onProductsChange();
    showMessage('Produk berhasil ditambahkan!');
  };

  // Handle edit product
  const handleEditProduct = (data) => {
    if (editProduct) {
      updateProduct(editProduct.id, data);
      onProductsChange();
      showMessage('Produk berhasil diupdate!');
      setEditProduct(null);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      deleteProduct(id);
      onProductsChange();
      showMessage('Produk berhasil dihapus!');
    }
  };

  // Handle click edit
  const handleClickEdit = (product) => {
    setEditProduct(product);
    setShowAddModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Package size={22} /> Inventaris Barang
        </h2>
        <button
          onClick={() => {
            setEditProduct(null);
            setShowAddModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          + Tambah Produk
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

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">Belum ada produk</p>
          <p className="text-sm">Klik "Tambah Produk" untuk menambahkan produk pertama</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleClickEdit}
              onDelete={handleDeleteProduct}
              onSell={() => onSellProduct(product)}
              showSell={false}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditProduct(null);
        }}
        onSave={editProduct ? handleEditProduct : handleAddProduct}
        editProduct={editProduct}
      />
    </div>
  );
};

export default InventoryTab;
