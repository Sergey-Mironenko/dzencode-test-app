'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { RootState } from '@/store/store';
import { deleteOrder, setSelectedOrderId } from '@/store/inventorySlice';
import DeleteModal from '@/components/DeleteModal';
import { OrderCard } from '@/components/OrderCard';
import OrderDetailsPanel from '@/components/OrderDetailsPanel';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, products, selectedOrderId } = useSelector(
    (state: RootState) => state.inventory
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  const getOrderStats = (orderId: number) => {
    const orderProducts = products.filter((p) => p.order === orderId);
    const totalUSD = orderProducts.reduce(
      (sum, p) =>
        sum + (p.price.find((pr) => pr.symbol === 'USD')?.value || 0),
      0
    );
    const totalUAH = orderProducts.reduce(
      (sum, p) =>
        sum + (p.price.find((pr) => pr.symbol === 'UAH')?.value || 0),
      0
    );
    return { count: orderProducts.length, totalUSD, totalUAH, orderProducts };
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOrderToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete !== null) {
      dispatch(deleteOrder(orderToDelete));
    }
    setModalOpen(false);
    setOrderToDelete(null);
  };

  const selectedOrderData = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : null;
  const selectedOrderStats = selectedOrderId
    ? getOrderStats(selectedOrderId)
    : null;
  const orderToDeleteData = orderToDelete
    ? orders.find((o) => o.id === orderToDelete)
    : null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-lime-500 border-[3px] border-lime-200 flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-lime-600 transition">
          <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
          Приходы / {orders.length}
        </h1>
      </div>

      <div className="flex gap-4 relative items-start">
        {/* Список приходов */}
        <div
          className={`transition-all duration-300 ease-in-out flex-col gap-3 lg:min-w-[284px] ${
            selectedOrderId ? 'hidden lg:flex lg:w-1/3' : 'flex w-full'
          }`}
        >
          {orders.map((order) => {
            const stats = getOrderStats(order.id);
            const isSelected = selectedOrderId === order.id;

            return (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={isSelected}
                hasSelectedOrder={Boolean(selectedOrderId)}
                stats={stats}
                onSelect={(id) => dispatch(setSelectedOrderId(id))}
                onDeleteClick={handleDeleteClick}
              />
            );
          })}
        </div>

        {/* Детали прихода (Split-View) */}
        {selectedOrderId && selectedOrderData && selectedOrderStats && (
          <OrderDetailsPanel
            order={selectedOrderData}
            products={selectedOrderStats.orderProducts}
            onClose={() => dispatch(setSelectedOrderId(null))}
          />
        )}
      </div>

      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Вы уверены, что хотите удалить этот приход?"
        itemData={
          orderToDeleteData
            ? {
                title: orderToDeleteData.title,
                photo: '/monitor.jpg',
              }
            : null
        }
      />
    </div>
  );
}