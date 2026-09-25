'use client';

import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemData?: {
    title: string;
    serialNumber?: number;
    photo?: string;
  } | null;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, itemData }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header and close button */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Data of the item to be deleted */}
        {itemData && (
          <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            {itemData.photo && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image src={itemData.photo} alt="product" fill className="object-contain" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-700 underline decoration-gray-400 decoration-dashed underline-offset-4 mb-1">
                {itemData.title}
              </p>
              {itemData.serialNumber && (
                <p className="text-xs text-gray-500">SN-{itemData.serialNumber}</p>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-6 py-4 bg-lime-500 flex justify-end items-center gap-4">
          <button 
            onClick={onClose}
            className="text-white font-semibold text-sm hover:text-lime-100 transition tracking-wider uppercase"
          >
            Отменить
          </button>
          <button 
            onClick={onConfirm}
            className="bg-white text-red-500 font-bold px-6 py-2 rounded-full shadow-md hover:bg-gray-50 flex items-center gap-2 text-sm transition uppercase"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        </div>

      </div>
    </div>
  );
}