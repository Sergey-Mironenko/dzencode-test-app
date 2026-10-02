'use client';

import { X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

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
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(108, 117, 125, 0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered mx-3 mx-sm-auto" style={{ maxWidth: '600px' }}>
        <div className="modal-content border-0 shadow-lg rounded-3 overflow-visible position-relative">
          
          {/* Close button positioned identically to OrderDetailsPanel */}
          <button 
            type="button"
            onClick={onClose}
            className="position-absolute bg-white rounded-circle shadow-sm border border-secondary-subtle d-flex align-items-center justify-content-center p-0 z-3"
            aria-label="Close"
            style={{ 
              width: '2rem', 
              height: '2rem',
              top: '-14px',
              right: '-14px'
            }}
          >
            <X 
              className="text-secondary" 
              style={{ 
                width: '1rem', 
                height: '1rem' 
              }} 
            />
          </button>

          {/* Header */}
          <div className="modal-header px-3 px-sm-4 py-3 border-bottom border-secondary-subtle pe-5">
            <h2 className="modal-title fs-6 fs-sm-5 fw-bold text-dark mb-0">{title}</h2>
          </div>

          {/* Data of the item to be deleted */}
          {itemData && (
            <div className="modal-body p-3 p-sm-4 border-bottom border-secondary-subtle bg-light d-flex align-items-center gap-3">
              <div className="w-2 h-2 rounded-circle bg-success flex-shrink-0" />
              {itemData.photo && (
                <div className="position-relative flex-shrink-0" style={{ width: '3rem', height: '3rem' }}>
                  <img
                    src={itemData.photo}
                    alt="product"
                    className="object-fit-contain w-100 h-100"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm fw-semibold text-dark text-decoration-underline text-decoration-secondary text-decoration-dashed mb-1 text-truncate">
                  {itemData.title}
                </p>
                {itemData.serialNumber && (
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>SN-{itemData.serialNumber}</p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="modal-footer px-3 px-sm-4 py-3 border-0 d-flex flex-column flex-sm-row justify-content-end align-items-stretch align-items-sm-center gap-2 gap-sm-3 rounded-bottom" style={{ backgroundColor: '#65a30d' }}>
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-link text-white text-decoration-none fw-semibold text-uppercase tracking-wider m-0 p-0 order-2 order-sm-1 text-center text-sm-start"
              style={{ fontSize: '0.875rem' }}
            >
              {t('cancel')}
            </button>
            <button 
              type="button"
              onClick={onConfirm}
              className="btn btn-light text-danger fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2 text-uppercase order-1 order-sm-2"
              style={{ fontSize: '0.875rem' }}
            >
              <Trash2 style={{ width: '1rem', height: '1rem' }} />
              {t('delete')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}