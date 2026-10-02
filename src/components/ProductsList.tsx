'use client';

import { Product, Order } from '@/types/index';
import { ProductCard } from './ProductCard';
import { useLanguage } from './LanguageContext';

interface ProductsListProps {
  products: Product[];
  orders: Order[];
  onDeleteClick: (id: number) => void;
}

export default function ProductsList({
  products,
  orders,
  onDeleteClick,
}: ProductsListProps) {
  const { t } = useLanguage();

  return (
    <div className="table-responsive pb-4 pb-sm-4 pb-md-4 pb-lg-4 px-2 px-sm-3 px-md-4 px-lg-4">
      <div className="d-flex flex-column gap-2 gap-sm-2.5 gap-md-3 gap-lg-3" style={{ minWidth: 'fit-content' }}>
        {products.map((product) => {
          const order = orders.find((o) => o.id === product.order);
          return (
            <ProductCard
              key={product.id}
              product={product}
              order={order}
              onDeleteClick={onDeleteClick}
            />
          );
        })}

        {products.length === 0 && (
          <div className="text-center py-5 text-secondary bg-white border border-secondary-subtle rounded-2">
            {t('noProductsFound')}
          </div>
        )}
      </div>
    </div>
  );
}
