'use client';

import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { deleteProduct } from '@/store/inventorySlice';
import { Trash2, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import DeleteModal from '@/components/DeleteModal';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, orders } = useSelector((state: RootState) => state.inventory);
  
  const [filterType, setFilterType] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(products.map(p => p.type)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (filterType === 'all') return products;
    return products.filter(p => p.type === filterType);
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

  const productToDeleteData = productToDelete ? products.find(p => p.id === productToDelete) : null;

  return (
    <div className="max-w-[95vw] mx-auto pb-10">

      <div className="flex items-center gap-8 mb-8 mt-4 pl-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Продукты / {filteredProducts.length}
        </h1>
        
        <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500 font-medium">Тип:</label>
            <div className="relative min-w-[200px]">
                <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                <option value="all">Все типы</option>
                {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
                </select>

                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            </div>
      </div>

      <div className="overflow-x-auto pb-6 px-4">
        <div className="w-max min-w-full flex flex-col gap-3">
          {filteredProducts.map((product) => {
            const order = orders.find(o => o.id === product.order);
            const usdPrice = product.price.find(p => p.symbol === 'USD')?.value || 0;
            const uahPrice = product.price.find(p => p.symbol === 'UAH')?.value || 0;

            return (
              <div 
                key={product.id}
                className="flex items-center gap-6 bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-[16px] shrink-0 flex justify-center">
                  <div className={`w-2 h-2 rounded-full ${product.status === 'Свободен' ? 'bg-yellow-300' : 'bg-gray-600'}`} />
                </div>

                <div className="relative w-[50px] h-12 shrink-0">
                  <Image
                    src={product.photo}
                    sizes="50px"
                    alt="product"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="w-[430px] shrink-0 min-w-0">
                  <p className="text-sm font-semibold text-gray-600 underline decoration-gray-300 underline-offset-4 line-clamp-1 mb-1" title={product.title}>
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-400">SN-{product.serialNumber}</p>
                </div>

                <div className={`w-[100px] shrink-0 text-sm font-medium ${product.status === 'Свободен' ? 'text-yellow-300' : 'text-gray-600'}`}>
                  {product.status}
                </div>

                <div className="w-[150px] shrink-0 flex flex-col justify-start text-gray-500 gap-1">
                  <div className="flex items-center gap-1">
                    <span className="w-4 text-xs">с</span>
                    <span className="text-gray-500 text-[16px]">{format(parseISO(product.guarantee.start), 'dd / MM / yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-4 text-xs">по</span>
                    <span className="text-gray-500">{format(parseISO(product.guarantee.end), 'dd / MM / yyyy')}</span>
                  </div>
                </div>

                <div className="w-[90px] shrink-0 text-sm text-gray-500">
                  {product.isNew === 1 ? 'новый' : 'Б / У'}
                </div>

                <div className="w-[100px] shrink-0 flex flex-col">
                  <span className="text-xs text-gray-400">{usdPrice} <span className="text-[10px]">USD</span></span>
                  <span className="text-sm font-normal text-gray-500">{uahPrice} <span className="text-[10px] font-medium">UAH</span></span>
                </div>

                <div className="w-[290px] shrink-0 min-w-0">
                  <p className={`text-m ${product.groupName ? 'text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-2' : 'text-gray-400'}`}>
                    {product.groupName || '—'}
                  </p>
                </div>

                <div className="w-[210px] shrink-0 min-w-0">
                  <p className={`text-m ${product.owner ? 'text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-2' : 'text-gray-400'}`}>
                    {product.owner || '—'}
                  </p>
                </div>

                <div className="w-[280px] shrink-0 min-w-0">
                  <p className="text-m text-gray-500 underline decoration-gray-300 underline-offset-4 line-clamp-2">
                    {order?.title || '—'}
                  </p>
                </div>

                <div className="w-[120px] shrink-0 flex flex-col items-center text-gray-400">
                  <span className="text-[10px] uppercase font-medium">
                    {order ? format(parseISO(order.date), 'MM / yy') : ''}
                  </span>
                  <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    {order ? format(parseISO(order.date), 'dd / MMM. / yyyy', { locale: ru }).toLowerCase() : ''}
                  </span>
                </div>

                <div className="w-[40px] shrink-0 flex justify-end">
                  <button 
                    onClick={() => handleDeleteClick(product.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-md">
              Продукты не найдены
            </div>
          )}
        </div>
      </div>

      <DeleteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={confirmDelete}
        title="Вы уверены, что хотите удалить этот продукт?"
        itemData={productToDeleteData ? {
          title: productToDeleteData.title,
          serialNumber: productToDeleteData.serialNumber,
          photo: productToDeleteData.photo
        } : null}
      />
    </div>
  );
}