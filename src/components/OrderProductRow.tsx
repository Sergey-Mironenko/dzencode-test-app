'use client';

import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { Product } from '@/types/index';
import { useLanguage } from './LanguageContext';

interface OrderProductRowProps {
  product: Product;
  onDelete?: () => void;
}

function OrderProductRowComponent({ product, onDelete }: OrderProductRowProps) {
  const { t } = useLanguage();

  const isFree = product.status === 'Свободен';

  const statusText = isFree
    ? t('freeStatus')
    : t('repairStatus');

  return (
    <div className="order-product-row d-flex align-items-center gap-2 gap-sm-3 p-2 w-100">
      {/* Status indicator */}
      <div
        className={`rounded-circle flex-shrink-0 ${
          isFree ? 'bg-warning-subtle' : 'bg-secondary'
        }`}
        style={{
          width: '0.5rem',
          height: '0.5rem',
          backgroundColor: isFree ? '#fde047' : undefined,
        }}
      />

      {/* Product image */}
      <div
        className="position-relative flex-shrink-0 bg-white border border-secondary-subtle rounded-1 p-1"
        style={{
          width: '2.5rem',
          height: '2.5rem',
        }}
      >
        <img
          src={product.photo}
          alt={product.title}
          className="w-100 h-100 object-fit-cover"
        />
      </div>

      {/* Product information */}
      <div className="flex-grow-1 min-w-0" style={{ minWidth: 0 }}>
        <p
          className="product-title text-secondary fw-medium mb-0"
          title={product.title}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            textDecorationLine: 'underline',
            textDecorationColor: 'rgba(108, 117, 125, 0.4)', // Тусклый цвет линии
            textDecorationThickness: '1px',
            textUnderlineOffset: '3px', // Чуть отодвигаем линию вниз для красоты
          }}
        >
          {product.title}
        </p>

        <p className="product-serial text-body-tertiary mb-0 mt-1" style={{ fontSize: '0.75rem' }}>
          SN-{product.serialNumber}
        </p>
      </div>

      {/* Status */}
      <div
        className={`d-none d-sm-block flex-shrink-0 fw-semibold text-truncate ${
          isFree ? 'text-warning' : 'text-secondary'
        }`}
        style={{
          width: '5rem',
          fontSize: '0.625rem',
        }}
      >
        {statusText}
      </div>

      {/* Delete */}
      <button
        type="button"
        className="order-product-delete btn btn-link text-secondary p-2 flex-shrink-0"
        aria-label="Delete product"
        onClick={onDelete}
      >
        <Trash2
          style={{
            width: '1rem',
            height: '1rem',
          }}
        />
      </button>
    </div>
  );
}

export const OrderProductRow = memo(OrderProductRowComponent);