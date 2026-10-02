'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { addProduct } from '@/store/inventorySlice';
import { useLanguage } from './LanguageContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

interface FormErrors {
  title?: string;
  serialNumber?: string;
  type?: string;
  usdPrice?: string;
  uahPrice?: string;
}

export default function AddProductModal({ isOpen, onClose, orderId }: AddProductModalProps) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [type, setType] = useState('Monitors');
  const [owner, setOwner] = useState('');
  const [groupName, setGroupName] = useState('');
  const [specification, setSpecification] = useState('Specification 1');
  const [usdPrice, setUsdPrice] = useState('');
  const [uahPrice, setUahPrice] = useState('');
  const [status, setStatus] = useState<'Свободен' | 'В ремонте'>('Свободен');
  const [isNew, setIsNew] = useState(1);

  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = t('errTitleMinLength');
    }

    if (!serialNumber.trim() || isNaN(Number(serialNumber))) {
      newErrors.serialNumber = t('errSerialNumberInvalid');
    }

    if (!usdPrice || Number(usdPrice) <= 0) {
      newErrors.usdPrice = t('errPriceUsd');
    }

    if (!uahPrice || Number(uahPrice) <= 0) {
      newErrors.uahPrice = t('errPriceUah');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const startDate = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    dispatch(
      addProduct({
        title,
        serialNumber: Number(serialNumber),
        type,
        specification,
        isNew,
        status,
        photo: type === 'Monitors' ? '/monitor.jpg' : '/laptop.jpg',
        guarantee: {
          start: startDate,
          end: endDate,
        },
        price: [
          { value: Number(usdPrice), symbol: 'USD', isDefault: 0 },
          { value: Number(uahPrice), symbol: 'UAH', isDefault: 1 },
        ],
        order: orderId,
        owner: owner.trim() || null,
        groupName: groupName.trim() || null,
      })
    );

    setTitle('');
    setOwner('');
    setGroupName('');
    setSerialNumber('');
    setUsdPrice('');
    setUahPrice('');
    setErrors({});
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(108, 117, 125, 0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered mx-3 mx-sm-auto" style={{ maxWidth: '500px' }}>
        <div className="modal-content border-0 shadow-lg rounded-3 overflow-visible position-relative">
          
          {/* Close button positioned cleanly in the corner */}
          <button 
            type="button" 
            onClick={onClose}
            className="position-absolute bg-white rounded-circle shadow-sm border border-secondary-subtle d-flex align-items-center justify-content-center p-0 z-3"
            style={{ 
              width: '2rem', 
              height: '2rem',
              top: '-14px',
              right: '-14px'
            }}
            aria-label="Close"
          >
            <X className="text-secondary" style={{ width: '1rem', height: '1rem' }} />
          </button>

          <div className="modal-header px-3 px-sm-4 py-3 border-bottom border-secondary-subtle pe-5">
            <h2 className="modal-title fs-6 fs-sm-5 fw-bold text-dark mb-0">
              {t('addProductTitle')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="modal-body p-3 p-sm-4 d-flex flex-column gap-3">
            <div>
              <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                {t('productNameLabel')}
              </label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('productNamePlaceholder')}
                className={`form-control form-control-sm ${errors.title ? 'is-invalid border-danger' : 'border-secondary-subtle'}`}
              />
              {errors.title && <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>{errors.title}</div>}
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('productOwnerLabel')}
                </label>
                <input 
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder={t('productOwnerPlaceholder')}
                  className="form-control form-control-sm border-secondary-subtle"
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('productGroupLabel')}
                </label>
                <input 
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder={t('productGroupPlaceholder')}
                  className="form-control form-control-sm border-secondary-subtle"
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('serialNumberLabel')}
                </label>
                <input 
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="123456789"
                  className={`form-control form-control-sm ${errors.serialNumber ? 'is-invalid border-danger' : 'border-secondary-subtle'}`}
                />
                {errors.serialNumber && <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>{errors.serialNumber}</div>}
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('typeLabel')}
                </label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="form-select form-select-sm border-secondary-subtle bg-white"
                >
                  <option value="Monitors">Monitors</option>
                  <option value="Laptops">Laptops</option>
                </select>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('priceUsdLabel')}
                </label>
                <input 
                  type="number"
                  value={usdPrice}
                  onChange={(e) => setUsdPrice(e.target.value)}
                  placeholder="200"
                  className={`form-control form-control-sm ${errors.usdPrice ? 'is-invalid border-danger' : 'border-secondary-subtle'}`}
                />
                {errors.usdPrice && <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>{errors.usdPrice}</div>}
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('priceUahLabel')}
                </label>
                <input 
                  type="number"
                  value={uahPrice}
                  onChange={(e) => setUahPrice(e.target.value)}
                  placeholder="8000"
                  className={`form-control form-control-sm ${errors.uahPrice ? 'is-invalid border-danger' : 'border-secondary-subtle'}`}
                />
                {errors.uahPrice && <div className="invalid-feedback" style={{ fontSize: '0.75rem' }}>{errors.uahPrice}</div>}
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('conditionLabel')}
                </label>
                <select 
                  value={isNew}
                  onChange={(e) => setIsNew(Number(e.target.value))}
                  className="form-select form-select-sm border-secondary-subtle bg-white"
                >
                  <option value={1}>{t('newItem')}</option>
                  <option value={0}>{t('usedItem')}</option>
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                  {t('statusLabel')}
                </label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Свободен' | 'В ремонте')}
                  className="form-select form-select-sm border-secondary-subtle bg-white"
                >
                  <option value="Свободен">{t('freeStatus')}</option>
                  <option value="В ремонте">{t('repairStatus')}</option>
                </select>
              </div>
            </div>

            <div className="mt-3 d-flex flex-column flex-sm-row justify-content-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline-secondary btn-sm px-3 fw-semibold order-2 order-sm-1"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-success btn-sm px-4 fw-bold text-white order-1 order-sm-2"
                style={{ backgroundColor: '#65a30d', borderColor: '#65a30d' }}
              >
                {t('save')}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}