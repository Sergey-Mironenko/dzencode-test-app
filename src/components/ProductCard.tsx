'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Product, Order } from '@/types/index';

interface ProductCardProps {
  product: Product;
  order?: Order;
  onDeleteClick: (id: number) => void;
}

function ProductCardComponent({ product, order, onDeleteClick }: ProductCardProps) {
  const usdPrice = product.price.find((p) => p.symbol === 'USD')?.value || 0;
  const uahPrice = product.price.find((p) => p.symbol === 'UAH')?.value || 0;

  return (
    <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 bg-white border border-gray-200 rounded-md p-3 sm:p-3.5 md:p-4 lg:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-[12px] sm:w-[14px] md:w-[15px] lg:w-[16px] shrink-0 flex justify-center">
        <div
          className={`w-2 h-2 rounded-full ${
            product.status === 'Свободен' ? 'bg-yellow-300' : 'bg-gray-600'
          }`}
        />
      </div>

      <div className="relative w-[42px] h-10 sm:w-[44px] sm:h-11 md:w-[48px] md:h-12 lg:w-[50px] lg:h-12 shrink-0">
        <Image
          src={product.photo}
          sizes="50px"
          alt="product"
          fill
          className="object-contain"
        />
      </div>

      <div className="w-[300px] sm:w-[340px] md:w-[390px] lg:w-[430px] shrink-0 min-w-0">
        <p
          className="text-xs sm:text-xs md:text-sm lg:text-sm font-semibold text-gray-600 underline decoration-gray-300 underline-offset-4 line-clamp-1 mb-1"
          title={product.title}
        >
          {product.title}
        </p>
        <p className="text-[10px] sm:text-[11px] md:text-xs lg:text-xs text-gray-400">
          SN-{product.serialNumber}
        </p>
      </div>

      <div
        className={`hidden lg:block w-[100px] shrink-0 text-sm font-medium ${
          product.status === 'Свободен' ? 'text-yellow-300' : 'text-gray-600'
        }`}
      >
        {product.status}
      </div>

      <div className="w-[125px] sm:w-[130px] md:w-[140px] lg:w-[150px] shrink-0 flex flex-col justify-start text-gray-500 gap-1">
        <div className="flex items-center gap-1">
          <span className="w-4 text-[10px] sm:text-[11px] md:text-xs lg:text-xs">
            с
          </span>
          <span className="text-gray-500 text-xs sm:text-sm md:text-[15px] lg:text-[16px]">
            {format(parseISO(product.guarantee.start), 'dd / MM / yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-4 text-[10px] sm:text-[11px] md:text-xs lg:text-xs">
            по
          </span>
          <span className="text-gray-500 text-xs sm:text-sm md:text-[15px] lg:text-base">
            {format(parseISO(product.guarantee.end), 'dd / MM / yyyy')}
          </span>
        </div>
      </div>

      <div className="w-[75px] sm:w-[80px] md:w-[85px] lg:w-[90px] shrink-0 text-xs sm:text-xs md:text-sm lg:text-sm text-gray-500">
        {product.isNew === 1 ? 'новый' : 'Б / У'}
      </div>

      <div className="w-[85px] sm:w-[90px] md:w-[95px] lg:w-[100px] shrink-0 flex flex-col">
        <span className="text-[10px] sm:text-[11px] md:text-xs lg:text-xs text-gray-400">
          {usdPrice} <span className="text-[9px] sm:text-[10px]">USD</span>
        </span>

        <span className="text-xs sm:text-sm md:text-sm lg:text-base font-normal text-gray-500">
          {uahPrice}{' '}
          <span className="text-[9px] sm:text-[10px] font-medium">UAH</span>
        </span>
      </div>

      <div className="w-[200px] sm:w-[220px] md:w-[255px] lg:w-[290px] shrink-0 min-w-0">
        <p
          className={`text-sm sm:text-sm md:text-base lg:text-m ${
            product.groupName
              ? 'text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-2'
              : 'text-gray-400'
          }`}
        >
          {product.groupName || '—'}
        </p>
      </div>

      <div className="w-[150px] sm:w-[165px] md:w-[200px] lg:w-[210px] shrink-0 min-w-0">
        <p
          className={`text-sm sm:text-sm md:text-base lg:text-m ${
            product.owner
              ? 'text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-2'
              : 'text-gray-400'
          }`}
        >
          {product.owner || '—'}
        </p>
      </div>

      <div className="w-[200px] sm:w-[220px] md:w-[250px] lg:w-[280px] shrink-0 min-w-0">
        <p className="text-sm sm:text-sm md:text-base lg:text-m text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-2">
          {order?.title || '—'}
        </p>
      </div>

      <div className="w-[105px] sm:w-[110px] md:w-[115px] lg:w-[120px] shrink-0 flex flex-col items-center text-gray-400">
        <span className="text-[9px] sm:text-[10px] md:text-[10px] lg:text-[10px] uppercase font-medium">
          {order ? format(parseISO(order.date), 'MM / yy') : ''}
        </span>

        <span className="text-xs sm:text-xs md:text-sm lg:text-md text-gray-500 font-medium whitespace-nowrap">
          {order
            ? format(parseISO(order.date), 'dd / MMM. / yyyy', {
                locale: ru,
              }).toLowerCase()
            : ''}
        </span>
      </div>

      <div className="w-[32px] sm:w-[34px] md:w-[36px] lg:w-[40px] shrink-0 flex justify-end">
        <button
          onClick={() => onDeleteClick(product.id)}
          className="text-gray-400 hover:text-red-500 transition p-1.5 sm:p-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-5 lg:h-5" />
        </button>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);