// Product Card component - displays a single product with actions
import React from 'react';
import { ShoppingCart, Pencil, Trash2, TriangleAlert } from 'lucide-react';

// Format number to Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProductCard = ({ product, onEdit, onDelete, onSell, compact = false, showSell = true }) => {
  const isLowStock = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md ${
      isOutOfStock
        ? 'border-red-200 dark:border-red-800'
        : isLowStock
        ? 'border-yellow-200 dark:border-yellow-800'
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className={compact ? 'p-3' : 'p-4'}>
        {/* Header: Name + Stock Badge */}
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-semibold text-gray-900 dark:text-gray-100 ${compact ? 'text-sm' : 'text-base'}`}>
            {product.name}
          </h4>
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
              Habis
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
              <TriangleAlert size={12} /> Sisa {product.stock}
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
              Stok: {product.stock}
            </span>
          )}
        </div>

        {/* Price */}
        <p className={`${compact ? 'text-sm' : 'text-lg'} font-bold text-emerald-600 dark:text-emerald-400 mb-3`}>
          {formatRupiah(product.price)}
          {!compact && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">/ pcs</span>}
        </p>

        {/* Actions */}
        {compact ? (
          /* Dashboard compact: sell button only */
          <button
            onClick={() => onSell(product)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <ShoppingCart size={16} /> Jual
          </button>
        ) : showSell ? (
          /* Full with sell: all three buttons */
          <div className="flex gap-2">
            <button
              onClick={() => onSell(product)}
              disabled={isOutOfStock}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                isOutOfStock
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <ShoppingCart size={16} /> Jual
            </button>
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Hapus"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          /* Inventory full: edit + delete only */
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Pencil size={16} /> Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="py-2 px-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 size={16} /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
