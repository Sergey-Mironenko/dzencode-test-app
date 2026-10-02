'use client';

import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Product, Order } from '@/types/index';
import { useLanguage } from './LanguageContext';

interface ProductCardProps {
  product: Product;
  order?: Order;
  onDeleteClick: (id: number) => void;
}

function ProductCardComponent({ product, order, onDeleteClick }: ProductCardProps) {
  const { language, t } = useLanguage();
  const dateLocale = language === 'ru' ? ru : enUS;

  const usdPrice = product.price.find((p) => p.symbol === 'USD')?.value || 0;
  const uahPrice = product.price.find((p) => p.symbol === 'UAH')?.value || 0;

  const statusText =
    product.status === 'Свободен' ? t('freeStatus') : t('repairStatus');

  return (
    <div className="d-flex align-items-center bg-white border border-secondary-subtle rounded-2 p-3 p-sm-3.5 p-md-4 p-lg-4 shadow-sm transition-shadow" style={{ gap: '1rem' }}>
      <div className="flex-shrink-0 d-flex justify-content-center" style={{ width: '16px' }}>
        <div
          className={`rounded-circle ${
            product.status === 'Свободен' ? 'bg-warning' : 'bg-secondary'
          }`}
          style={{ width: '8px', height: '8px' }}
        />
      </div>

      <div className="position-relative flex-shrink-0" style={{ width: '50px', height: '48px' }}>
        <img
          src={product.photo}
          alt={t('productAlt')}
          className="object-fit-contain w-100 h-100"
        />
      </div>

      <div className="flex-shrink-0 min-w-0" style={{ width: '430px' }}>
        <p
          className="text-secondary fw-bold text-decoration-underline text-truncate mb-1"
          style={{ fontSize: '0.875rem', textUnderlineOffset: '4px', textDecorationColor: '#dee2e6' }}
          title={product.title}
        >
          {product.title}
        </p>
        <p className="text-body-tertiary mb-0" style={{ fontSize: '11px' }}>
          {`SN-${product.serialNumber}`}
        </p>
      </div>

      <div
        className={`d-none d-lg-block flex-shrink-0 fw-medium ${
          product.status === 'Свободен' ? 'text-warning' : 'text-secondary'
        }`}
        style={{ width: '100px', fontSize: '0.875rem' }}
      >
        {statusText}
      </div>

      <div className="flex-shrink-0 d-flex flex-column justify-start text-secondary gap-1" style={{ width: '150px' }}>
        <div className="d-flex align-items-center gap-1">
          <span className="text-body-tertiary" style={{ width: '16px', fontSize: '11px' }}>
            {t('from')}
          </span>
          <span className="text-secondary" style={{ fontSize: '1rem' }}>
            {format(parseISO(product.guarantee.start), 'dd / MM / yyyy')}
          </span>
        </div>

        <div className="d-flex align-items-center gap-1">
          <span className="text-body-tertiary" style={{ width: '16px', fontSize: '11px' }}>
            {t('to')}
          </span>
          <span className="text-secondary" style={{ fontSize: '1rem' }}>
            {format(parseISO(product.guarantee.end), 'dd / MM / yyyy')}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 text-secondary" style={{ width: '90px', fontSize: '0.875rem' }}>
        {product.isNew === 1 ? t('newItem') : t('usedItem')}
      </div>

      <div className="flex-shrink-0 d-flex flex-column" style={{ width: '100px' }}>
        <span className="text-body-tertiary" style={{ fontSize: '11px' }}>
          {usdPrice} <span style={{ fontSize: '10px' }}>USD</span>
        </span>

        <span className="text-secondary fw-normal" style={{ fontSize: '1rem' }}>
          {uahPrice}{' '}
          <span className="fw-medium" style={{ fontSize: '10px' }}>
            UAH
          </span>
        </span>
      </div>

      <div className="flex-shrink-0 min-w-0" style={{ width: '290px' }}>
        <p
          className={`mb-0 ${
            product.groupName
              ? 'text-secondary text-decoration-underline line-clamp-2'
              : 'text-body-tertiary'
          }`}
          style={product.groupName ? { fontSize: '1rem', textUnderlineOffset: '4px', textDecorationColor: '#dee2e6' } : { fontSize: '1rem' }}
        >
          {product.groupName || '—'}
        </p>
      </div>

      <div className="flex-shrink-0 min-w-0" style={{ width: '210px' }}>
        <p
          className={`mb-0 ${
            product.owner
              ? 'text-secondary text-decoration-underline line-clamp-2'
              : 'text-body-tertiary'
          }`}
          style={product.owner ? { fontSize: '1rem', textUnderlineOffset: '4px', textDecorationColor: '#dee2e6' } : { fontSize: '1rem' }}
        >
          {product.owner || '—'}
        </p>
      </div>

      <div className="flex-shrink-0 min-w-0" style={{ width: '280px' }}>
        <p
          className={`mb-0 ${
            order?.title
              ? 'text-secondary text-decoration-underline line-clamp-2'
              : 'text-body-tertiary'
          }`}
          style={order?.title ? { fontSize: '1rem', textUnderlineOffset: '4px', textDecorationColor: '#dee2e6' } : { fontSize: '1rem' }}
        >
          {order?.title || '—'}
        </p>
      </div>

      <div className="flex-shrink-0 d-flex flex-column align-items-center text-body-tertiary" style={{ width: '120px' }}>
        <span className="text-uppercase fw-medium" style={{ fontSize: '10px' }}>
          {order ? format(parseISO(order.date), 'MM / yy') : ''}
        </span>

        <span className="text-secondary fw-medium text-nowrap" style={{ fontSize: '1rem' }}>
          {order
            ? format(parseISO(order.date), 'dd / MMM. / yyyy', {
                locale: dateLocale,
              }).toLowerCase()
            : ''}
        </span>
      </div>

      <div className="flex-shrink-0 d-flex justify-content-end" style={{ width: '40px' }}>
        <button
          type="button"
          onClick={() => onDeleteClick(product.id)}
          className="btn btn-link text-body-tertiary p-2 text-decoration-none hover-danger"
          style={{ transition: 'color 0.15s ease-in-out' }}
        >
          <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);