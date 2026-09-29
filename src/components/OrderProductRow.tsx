'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Product } from '@/types/index';

interface OrderProductRowProps {
  product: Product;
}

function OrderProductRowComponent({ product }: OrderProductRowProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 p-2 hover:bg-gray-50 border-b border-gray-50 transition rounded-md group">
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          product.status === 'Свободен' ? 'bg-yellow-300' : 'bg-gray-600'
        }`}
      />

      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-white border border-gray-200 rounded p-1">
        <Image
          src={product.photo}
          alt={product.title}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-1 underline decoration-gray-300 decoration-2 underline-offset-2">
          {product.title}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
          SN-{product.serialNumber}
        </p>
      </div>

      <div
        className={`hidden sm:block w-20 sm:w-24 text-[10px] sm:text-xs font-semibold ${
          product.status === 'Свободен' ? 'text-yellow-300' : 'text-gray-600'
        }`}
      >
        {product.status}
      </div>

      <button className="text-gray-400 hover:text-red-500 opacity-100 lg:opacity-0 group-hover:opacity-100 transition p-2">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export const OrderProductRow = memo(OrderProductRowComponent);