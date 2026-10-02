'use client';

import { memo } from 'react';
import { List, Trash2, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Order, Product } from '@/types/index';
import { useLanguage } from './LanguageContext';

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
  const { language, t } = useLanguage();

  const dateLocale = language === 'ru' ? ru : enUS;
  const dateObj = parseISO(order.date);

  return (
    <div
      onClick={() => onSelect(order.id)}
      className={`order-card position-relative overflow-hidden mx-2 mx-sm-0 d-flex flex-column flex-lg-row align-items-lg-center border rounded-2 p-3 p-lg-4 ${
        isSelected
          ? 'order-card-selected bg-light border-secondary-subtle'
          : 'order-card-default bg-white border-secondary-subtle'
      }`}
      style={{ gap: '1rem' }}
    >
      {!hasSelectedOrder && (
        <div 
          className="d-flex align-items-center w-100 w-lg-auto flex-lg-grow-1 pe-lg-3 min-w-0"
        >
          <div 
            className="order-card-title flex-grow-1 text-secondary fw-normal text-truncate mt-1 text-decoration-underline" 
            style={{ textUnderlineOffset: '4px', minWidth: '0' }}
          >
            {order.title}
          </div>

          <button
            type="button"
            onClick={(e) => onDeleteClick(e, order.id)}
            className="d-lg-none btn btn-link text-secondary p-2 me-n2 mt-n2 flex-shrink-0 text-decoration-none"
            aria-label="Delete order"
          >
            <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
      )}

      <div
        className={`d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between justify-content-lg-start flex-shrink-0 ${
          hasSelectedOrder ? 'flex-grow-1 min-w-0 pe-lg-4' : ''
        }`}
        style={{ gap: '1.5rem' }}
      >
        <div
          className={`d-flex align-items-center gap-3 flex-shrink-0 pe-4 ${
            hasSelectedOrder ? 'flex-grow-1 min-w-0' : 'w-auto'
          }`}
          style={{ width: hasSelectedOrder ? 'auto' : '' }}
        >
          <div
            className="rounded-circle border border-secondary-subtle d-flex align-items-center justify-content-center bg-white text-secondary flex-shrink-0"
            style={{ width: '2rem', height: '2rem' }}
          >
            <List style={{ width: '1rem', height: '1rem' }} />
          </div>

          <div className="d-flex flex-column min-w-0">
            <span className="text-secondary fw-normal lh-1" style={{ fontSize: '1.125rem' }}>
              {stats.count}
            </span>
            <span className="text-body-tertiary fw-normal text-nowrap" style={{ fontSize: '12px' }}>
              {t('productsCount')}
            </span>
          </div>
        </div>

        <div
          className={`d-flex flex-column text-secondary flex-shrink-0 ${
            hasSelectedOrder ? 'align-items-center' : 'align-items-start'
          }`}
          style={{ width: hasSelectedOrder ? 'auto' : '140px' }}
        >
          <span className="text-uppercase fw-medium text-nowrap" style={{ fontSize: '10px' }}>
            {format(dateObj, 'MM / yy')}
          </span>
          <span className="text-secondary fw-normal text-nowrap" style={{ fontSize: '0.875rem' }}>
            {format(dateObj, 'dd / MMM / yyyy', { locale: dateLocale })}
          </span>
        </div>

        {!hasSelectedOrder && (
          <div
            className="d-flex flex-column text-start flex-shrink-0"
            style={{ width: '140px' }}
          >
            <span className="text-body-tertiary text-nowrap" style={{ fontSize: '0.75rem' }}>
              {stats.totalUSD} <span style={{ fontSize: '10px' }}>USD</span>
            </span>
            <span className="text-secondary fw-medium text-nowrap" style={{ fontSize: '0.875rem' }}>
              {stats.totalUAH}{' '}
              <span className="fw-medium" style={{ fontSize: '10px' }}>
                UAH
              </span>
            </span>
          </div>
        )}
      </div>

      {isSelected && (
        <div
          className="position-absolute end-0 top-0 bottom-0 bg-secondary-subtle d-flex align-items-center justify-content-center rounded-end-2"
          style={{ width: '2rem' }}
        >
          <ChevronRight className="text-secondary" style={{ width: '1.25rem', height: '1.25rem' }} />
        </div>
      )}

      {!hasSelectedOrder && (
        <div className="d-none d-lg-flex flex-shrink-0 justify-content-end">
          <button
            type="button"
            onClick={(e) => onDeleteClick(e, order.id)}
            className="btn btn-link text-secondary p-2 text-decoration-none"
            aria-label="Delete order"
          >
            <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
      )}
    </div>
  );
}

export const OrderCard = memo(OrderCardComponent);