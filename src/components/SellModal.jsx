// Sell Modal component - multi-item cart with payment status
import React, { useState, useEffect } from 'react';

// Format number to Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const SellModal = ({ isOpen, onClose, products, onSell, initialProduct }) => {
  const [cart, setCart] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('cash');
  const [buyerName, setBuyerName] = useState('');

  // Reset cart when modal opens, add initialProduct if provided
  useEffect(() => {
    if (isOpen) {
      if (initialProduct) {
        setCart([{
          productId: initialProduct.id,
          name: initialProduct.name,
          price: initialProduct.price,
          quantity: 1,
          subtotal: initialProduct.price,
        }]);
      } else {
        setCart([]);
      }
      setPaymentStatus('cash');
      setBuyerName('');
    }
  }, [isOpen, initialProduct]);

  // Get available products (stock > 0)
  const availableProducts = products.filter(p => p.stock > 0);

  // Add item to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      // Check if we have enough stock
      if (existing.quantity < product.stock) {
        setCart(prev =>
          prev.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
              : item
          )
        );
      }
    } else {
      setCart(prev => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ]);
    }
  };

  // Remove one quantity from cart
  const removeFromCart = (productId) => {
    const existing = cart.find(item => item.productId === productId);
    if (existing && existing.quantity > 1) {
      setCart(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1, subtotal: (item.quantity - 1) * item.price }
            : item
        )
      );
    } else {
      setCart(prev => prev.filter(item => item.productId !== productId));
    }
  };

  // Remove item completely from cart
  const removeItemCompletely = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Handle sell
  const handleSell = () => {
    if (cart.length === 0 || !buyerName.trim()) return;

    onSell(cart, paymentStatus, buyerName.trim());
    setCart([]);
    setBuyerName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            🛒 Jual Barang
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Product Selection */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pilih Produk:
            </h4>
            {availableProducts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Tidak ada produk yang tersedia
              </p>
            ) : (
              <div className="space-y-2">
                {availableProducts.map(product => {
                  const inCart = cart.find(item => item.productId === product.id);
                  const maxReached = inCart && inCart.quantity >= product.stock;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatRupiah(product.price)} • Stok: {product.stock}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={maxReached}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          maxReached
                            ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keranjang:
              </h4>
              <div className="space-y-2">
                {cart.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRupiah(item.price)} x {item.quantity} = {formatRupiah(item.subtotal)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm font-medium transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => removeItemCompletely(item.productId)}
                        className="w-7 h-7 flex items-center justify-center bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm transition-colors"
                        title="Hapus dari keranjang"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {/* Total */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Total:</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatRupiah(total)}
            </span>
          </div>

          {/* Buyer Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Pembeli *
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Atas nama siapa..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Payment Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Pembayaran
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentStatus('cash')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  paymentStatus === 'cash'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                💵 Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentStatus('utang')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  paymentStatus === 'utang'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                🧾 Utang
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSell}
              disabled={cart.length === 0 || !buyerName.trim()}
              className={`flex-1 font-medium py-2.5 rounded-lg transition-colors ${
                cart.length === 0 || !buyerName.trim()
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              Jual Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellModal;
