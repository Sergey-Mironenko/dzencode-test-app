'use client';

import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { deleteProduct } from '@/store/inventorySlice';
import DeleteModal from '@/components/DeleteModal';
import ProductFilter from '@/components/ProductFilter';
import ProductsList from '@/components/ProductsList';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, orders } = useSelector((state: RootState) => state.inventory);

  const [filterType, setFilterType] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.type)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (filterType === 'all') return products;
    return products.filter((p) => p.type === filterType);
  }, [products, filterType]);

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete !== null) {
      dispatch(deleteProduct(productToDelete));
    }
    setModalOpen(false);
    setProductToDelete(null);
  };

  const productToDeleteData = productToDelete
    ? products.find((p) => p.id === productToDelete)
    : null;

  return (
    <div className="max-w-[95vw] mx-auto pb-10">
      <ProductFilter
        totalCount={filteredProducts.length}
        filterType={filterType}
        uniqueTypes={uniqueTypes}
        onFilterChange={setFilterType}
      />

      <ProductsList
        products={filteredProducts}
        orders={orders}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Вы уверены, что хотите удалить этот продукт?"
        itemData={
          productToDeleteData
            ? {
                title: productToDeleteData.title,
                serialNumber: productToDeleteData.serialNumber,
                photo: productToDeleteData.photo,
              }
            : null
        }
      />
    </div>
  );
}