'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, X } from 'lucide-react';
import { Order, Product } from '@/types/index';
import { OrderProductRow } from './OrderProductRow';
import { useLanguage } from './LanguageContext';

const AddProductModal = dynamic(() => import('./AddProductModal'), {
  ssr: false,
});

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className="order-details-panel w-100 bg-white border border-secondary-subtle rounded-3 shadow-sm position-relative p-3 p-lg-4 pt-4 pt-lg-4 overflow-visible"
      style={{
        maxWidth: '800px',
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="order-details-close position-absolute bg-white rounded-circle shadow-sm border border-secondary-subtle d-flex align-items-center justify-content-center p-0 z-3"
        aria-label="Close"
        style={{
          width: '2rem',
          height: '2rem',
          top: '-14px',
          right: '-14px',
        }}
      >
        <X
          className="text-secondary"
          style={{
            width: '1rem',
            height: '1rem',
          }}
        />
      </button>

      {/* Title */}
      <div className="pb-2 mb-3 mb-lg-4 pe-4 min-w-0">
        <h2
          className="text-dark fw-bold fs-6 fs-lg-5 mb-0 text-truncate"
          title={order.title}
        >
          {order.title}
        </h2>
      </div>

      {/* Add product */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 mb-3 mb-lg-4 fw-semibold"
        style={{
          color: '#65a30d',
        }}
      >
        <span
          className="rounded-circle text-white shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            backgroundColor: '#65a30d',
            width: '1.25rem',
            height: '1.25rem',
          }}
        >
          <Plus
            style={{
              width: '0.875rem',
              height: '0.875rem',
            }}
          />
        </span>

        <span style={{ fontSize: '0.875rem' }}>
          {t('addProduct')}
        </span>
      </button>

      {/* Products */}
      <div className="d-flex flex-column gap-2 gap-lg-3 border-top border-light pt-3">
        {products.map((product) => (
          <OrderProductRow
            key={product.id}
            product={product}
          />
        ))}

        {products.length === 0 && (
          <p
            className="text-secondary text-center py-4 mb-0"
            style={{
              fontSize: '0.875rem',
            }}
          >
            {t('noProducts')}
          </p>
        )}
      </div>

      {/* Add product modal */}
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          orderId={order.id}
        />
      )}
    </div>
  );
}