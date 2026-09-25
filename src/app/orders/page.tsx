'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { deleteOrder, setSelectedOrderId } from '@/store/inventorySlice';
import { Plus, List, Trash2, ChevronRight, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import DeleteModal from '@/components/DeleteModal';

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, products, selectedOrderId } = useSelector((state: RootState) => state.inventory);

  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  const getOrderStats = (orderId: number) => {
    const orderProducts = products.filter(p => p.order === orderId);
    const totalUSD = orderProducts.reduce((sum, p) => sum + (p.price.find(pr => pr.symbol === 'USD')?.value || 0), 0);
    const totalUAH = orderProducts.reduce((sum, p) => sum + (p.price.find(pr => pr.symbol === 'UAH')?.value || 0), 0);
    return { count: orderProducts.length, totalUSD, totalUAH, orderProducts };
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // To prevent Split View from opening when clicking the Trash
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

  const selectedOrderData = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;
  const selectedOrderStats = selectedOrderId ? getOrderStats(selectedOrderId) : null;
  const orderToDeleteData = orderToDelete ? orders.find(o => o.id === orderToDelete) : null;

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-lime-500 border-[3px] border-lime-200 flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-lime-600 transition">
          <Plus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Приходы / {orders.length}
        </h1>
      </div>

      {/* Main container with Split-View */}
      <div className="flex gap-4 relative items-start">

        {/* LEFT COLUMN: List of orders */}
        <div className={`transition-all duration-300 ease-in-out flex flex-col gap-3 ${selectedOrderId ? 'w-1/3' : 'w-full'}`}>
          {orders.map((order) => {
            const stats = getOrderStats(order.id);
            const isSelected = selectedOrderId === order.id;
            const dateObj = parseISO(order.date);

            return (
              <div 
                key={order.id}
                onClick={() => dispatch(setSelectedOrderId(order.id))}
                className={`flex items-center justify-between border rounded-md p-4 cursor-pointer transition-all ${
                  isSelected ? 'bg-gray-100 border-gray-300 shadow-inner' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Title (hidden in split-view) */}
                {!selectedOrderId && (
                  <div className="flex-1 text-lg font-normal text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-1 pr-4">
                    {order.title}
                  </div>
                )}

                {/* Block with a list icon and the number of products */}
                <div className="flex items-center gap-3 w-32 border-l border-gray-200 pl-4 h-full">
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white text-gray-500">
                    <List className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-normal text-gray-500 leading-none">{stats.count}</span>
                    <span className="text-[12px] text-gray-400 font-normal">Продукта</span>
                  </div>
                </div>

                {/* Date block */}
                <div className="flex flex-col items-center w-32 text-gray-400 border-l border-gray-200 pl-4">
                  <span className="text-[10px] uppercase font-medium">
                    {format(dateObj, 'MM / yy')}
                  </span>
                  <span className="text-sm text-gray-500 font-normal whitespace-nowrap">
                    {format(dateObj, 'dd / MMM / yyyy', { locale: ru })}
                  </span>
                </div>

                {/* Pricing block (hidden in split-view) */}
                {!selectedOrderId && (
                  <div className="flex flex-col w-40 text-right pr-6 border-l border-gray-200 pl-4">
                    <span className="text-xs text-gray-400">
                      {stats.totalUSD} <span className="text-[10px]">USD</span>
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {stats.totalUAH} <span className="text-[10px] font-medium">UAH</span>
                    </span>
                  </div>
                )}

                {/* Delete button (hidden for unselected items if another one is open) */}
                {(!selectedOrderId || isSelected) && (
                  <div className="flex-shrink-0 w-10 flex justify-end">
                    {isSelected ? (
                      <div className="w-8 h-10 bg-gray-200 -mr-4 rounded-l-md flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => handleDeleteClick(e, order.id)}
                        className="text-gray-400 hover:text-red-500 transition p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Order details */}
        {selectedOrderId && selectedOrderData && selectedOrderStats && (
          <div className="w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm relative p-6 animate-in slide-in-from-right-4 duration-300">
            
            {/* Details close button */}
            <button 
              onClick={() => dispatch(setSelectedOrderId(null))}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-6">{selectedOrderData.title}</h2>
            
            <div className="flex items-center gap-2 mb-6 cursor-pointer text-lime-600 hover:text-lime-700 transition">
              <div className="w-6 h-6 rounded-full bg-lime-500 flex items-center justify-center text-white shadow-sm">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">Добавить продукт</span>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
              {selectedOrderStats.orderProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 border-b border-gray-50 transition rounded-md group">
                  
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${product.status === 'Свободен' ? 'bg-yellow-300' : 'bg-gray-400'}`} />

                {/* Product Photo */}
                <div className="relative w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded p-1">
                <Image src={product.photo} alt={product.title} fill className="object-contain" />
                </div>

                {/* Product information */}
                <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium line-clamp-1 underline decoration-gray-300 decoration-2 underline-offset-2">{product.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">SN-{product.serialNumber}</p>
                </div>

                {/* Status in text */}
                <div className={`w-24 text-xs font-semibold ${product.status === 'Свободен' ? 'text-yellow-300' : 'text-gray-400'}`}>
                {product.status}
                </div>
                  
                  {/* Product deleting */}
                  <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {selectedOrderStats.orderProducts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">В этом приходе нет продуктов</p>
              )}
            </div>
          </div>
        )}

      </div>

      <DeleteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={confirmDelete}
        title="Вы уверены, что хотите удалить этот приход?"
        itemData={orderToDeleteData ? { 
          title: orderToDeleteData.title,
          photo: '/monitor.jpg'
        } : null}
      />
    </div>
  );
}