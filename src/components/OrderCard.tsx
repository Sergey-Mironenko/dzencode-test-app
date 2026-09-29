'use client';

import { memo } from 'react';
import { List, Trash2, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Order, Product } from '@/types/index';

interface OrderStats {
  count: number;
  totalUSD: number;
  totalUAH: number;
  orderProducts: Product[];
}

interface OrderCardProps {
  order: Order;
  isSelected: boolean;
  hasSelectedOrder: boolean;
  stats: OrderStats;
  onSelect: (id: number) => void;
  onDeleteClick: (e: React.MouseEvent, id: number) => void;
}

function OrderCardComponent({
  order,
  isSelected,
  hasSelectedOrder,
  stats,
  onSelect,
  onDeleteClick,
}: OrderCardProps) {
  const dateObj = parseISO(order.date);

  return (
    <div
      onClick={() => onSelect(order.id)}
      className={`relative overflow-hidden mx-2 sm:mx-0 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 border rounded-md p-4 cursor-pointer transition-all ${
        isSelected
          ? 'bg-gray-100 border-gray-300 shadow-inner'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {!hasSelectedOrder && (
        <div className="flex justify-between items-start lg:items-center w-full lg:w-auto lg:flex-1 lg:min-w-0">
          <div className="flex-1 min-w-0 text-lg font-normal text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-1 mt-1">
            {order.title}
          </div>
          <button
            onClick={(e) => onDeleteClick(e, order.id)}
            className="lg:hidden text-gray-400 hover:text-red-500 transition p-2 -mr-2 -mt-2 shrink-0"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}

      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-start gap-4 lg:gap-0 sm:pr-8 lg:pr-0 ${
          hasSelectedOrder ? 'flex-1 min-w-0 lg:pr-6' : 'w-full lg:w-auto'
        }`}
      >
        {/* Количество продуктов */}
        <div
          className={`flex items-center gap-3 shrink-0 ${
            hasSelectedOrder ? 'flex-1 min-w-0' : 'w-auto lg:w-[110px]'
          }`}
        >
          <div className="w-8 h-8 shrink-0 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-500">
            <List className="w-4 h-4" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-lg font-normal text-gray-500 leading-none">
              {stats.count}
            </span>
            <span className="text-[12px] text-gray-400 font-normal whitespace-nowrap">
              Продукта
            </span>
          </div>
        </div>

        {/* Дата */}
        <div
          className={`flex flex-col items-start sm:items-center text-gray-400 shrink-0 ${
            hasSelectedOrder
              ? 'min-w-[120px] items-center'
              : 'w-auto lg:w-[190px]'
          }`}
        >
          <span className="text-[10px] uppercase font-medium whitespace-nowrap">
            {format(dateObj, 'MM / yy')}
          </span>
          <span className="text-xs lg:text-sm text-gray-500 font-normal whitespace-nowrap">
            {format(dateObj, 'dd / MMM / yyyy', { locale: ru })}
          </span>
        </div>

        {/* Суммы */}
        {!hasSelectedOrder && (
          <div className="w-auto lg:w-[150px] shrink-0 flex flex-col text-left">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {stats.totalUSD} <span className="text-[10px]">USD</span>
            </span>
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
              {stats.totalUAH}{' '}
              <span className="text-[10px] font-medium">UAH</span>
            </span>
          </div>
        )}
      </div>

      {/* Стрелочка активного прихода */}
      {isSelected && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gray-200 flex items-center justify-center rounded-r-md">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </div>
      )}

      {/* Кнопка удаления для десктопа */}
      {!hasSelectedOrder && (
        <div className="hidden lg:flex w-8 shrink-0 justify-end">
          <button
            onClick={(e) => onDeleteClick(e, order.id)}
            className="text-gray-400 hover:text-red-500 transition p-2"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export const OrderCard = memo(OrderCardComponent);