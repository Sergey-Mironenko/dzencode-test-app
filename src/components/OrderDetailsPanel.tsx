'use client';

import { Plus, X } from 'lucide-react';
import { Order, Product } from '@/types/index';
import { OrderProductRow } from './OrderProductRow';

interface OrderDetailsPanelProps {
  order: Order;
  products: Product[];
  onClose: () => void;
}

export default function OrderDetailsPanel({
  order,
  products,
  onClose,
}: OrderDetailsPanelProps) {
  return (
    <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm relative p-4 lg:p-6 animate-in slide-in-from-right-4 duration-300">
      <button
        onClick={onClose}
        className="absolute -top-3 -right-2 lg:-right-3 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer z-10"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      <h2 className="text-lg font-bold text-gray-800 mb-4 lg:mb-6 pr-4">
        {order.title}
      </h2>

      <div className="flex items-center gap-2 mb-4 lg:mb-6 cursor-pointer text-lime-600 hover:text-lime-700 transition w-max">
        <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-lime-500 flex items-center justify-center text-white shadow-sm">
          <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
        </div>
        <span className="text-sm font-semibold">Добавить продукт</span>
      </div>

      <div className="flex flex-col gap-2 lg:gap-3 border-t border-gray-100 pt-3">
        {products.map((product) => (
          <OrderProductRow key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            В этом приходе нет продуктов
          </p>
        )}
      </div>
    </div>
  );
}