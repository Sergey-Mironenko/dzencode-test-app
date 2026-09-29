'use client';

import { Product, Order } from '@/types/index';
import { ProductCard } from './ProductCard';

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
  return (
    <div className="overflow-x-auto pb-5 sm:pb-5 md:pb-6 lg:pb-6 px-2 sm:px-3 md:px-4 lg:px-4">
      <div className="w-max min-w-full flex flex-col gap-2 sm:gap-2.5 md:gap-3 lg:gap-3">
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
          <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-md">
            Продукты не найдены
          </div>
        )}
      </div>
    </div>
  );
}