'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { RootState } from '@/store/store';
import {
  deleteOrder,
  setSelectedOrderId,
} from '@/store/inventorySlice';
import { OrderCard } from '@/components/OrderCard';

const DeleteModal = dynamic(
  () => import('@/components/DeleteModal'),
  {
    ssr: false,
  }
);

const OrderDetailsPanel = dynamic(
  () => import('@/components/OrderDetailsPanel'),
  {
    ssr: false,
  }
);

export default function OrdersPage() {
  const dispatch = useDispatch();

  const {
    orders,
    products,
    selectedOrderId,
  } = useSelector(
    (state: RootState) => state.inventory
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] =
    useState<number | null>(null);

  const getOrderStats = (orderId: number) => {
    const orderProducts = products.filter(
      (p) => p.order === orderId
    );

    const totalUSD = orderProducts.reduce(
      (sum, p) =>
        sum +
        (p.price.find(
          (pr) => pr.symbol === 'USD'
        )?.value || 0),
      0
    );

    const totalUAH = orderProducts.reduce(
      (sum, p) =>
        sum +
        (p.price.find(
          (pr) => pr.symbol === 'UAH'
        )?.value || 0),
      0
    );

    return {
      count: orderProducts.length,
      totalUSD,
      totalUAH,
      orderProducts,
    };
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    id: number
  ) => {
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
    ? orders.find(
        (o) => o.id === selectedOrderId
      )
    : null;

  const selectedOrderStats = selectedOrderId
    ? getOrderStats(selectedOrderId)
    : null;

  const orderToDeleteData = orderToDelete
    ? orders.find(
        (o) => o.id === orderToDelete
      )
    : null;

  return (
    <div className="orders-page w-100 mx-auto px-3 px-sm-4 px-lg-5 py-3 py-sm-4 py-lg-5">
      {/* Top Header */}
      <div className="d-flex align-items-center gap-3 gap-md-4 mb-4 mb-sm-4 mb-lg-5">
        <button
          type="button"
          className="orders-add-button border-0 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#65a30d',
          }}
          aria-label="Add Order"
        >
          <Plus size={20} />
        </button>

        <h1 className="fw-bold text-dark m-0">
          Приходы / {orders.length}
        </h1>
      </div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-lg-row gap-3 gap-lg-4 position-relative align-items-start">
        {/* Orders list */}
        <div
          className={`orders-list d-flex flex-column gap-3 ${
            selectedOrderId
              ? 'd-none d-lg-flex'
              : 'w-100'
          }`}
        >
          {orders.map((order) => {
            const stats = getOrderStats(order.id);
            const isSelected =
              selectedOrderId === order.id;

            return (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={isSelected}
                hasSelectedOrder={Boolean(
                  selectedOrderId
                )}
                stats={stats}
                onSelect={(id) =>
                  dispatch(setSelectedOrderId(id))
                }
                onDeleteClick={handleDeleteClick}
              />
            );
          })}
        </div>

        {/* Selected Order */}
        {selectedOrderId &&
          selectedOrderData &&
          selectedOrderStats && (
            <div className="order-details-wrapper w-100 flex-grow-1">
              <OrderDetailsPanel
                order={selectedOrderData}
                products={
                  selectedOrderStats.orderProducts
                }
                onClose={() =>
                  dispatch(
                    setSelectedOrderId(null)
                  )
                }
              />
            </div>
          )}
      </div>

      {/* Delete Modal */}
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