'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

interface ProductFilterProps {
  totalCount: number;
  filterType: string;
  uniqueTypes: string[];
  onFilterChange: (type: string) => void;
}

export default function ProductFilter({
  totalCount,
  filterType,
  uniqueTypes,
  onFilterChange,
}: ProductFilterProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = filterType === 'all' ? t('allTypes') : filterType;

  return (
    <div className="d-flex align-items-center gap-3 gap-sm-4 mb-4 pb-4 mt-3 ps-2 ps-sm-3">
      <h1 className="text-dark fw-bold fs-sm-4 fs-md-7 mb-0">
        {t('products')} / {totalCount}
      </h1>
      <div className="d-flex align-items-center gap-2">
        <span className="text-secondary fw-medium" style={{ fontSize: '0.8125rem' }}>
          {t('type')}:
        </span>

        <div className="position-relative" style={{ minWidth: '150px' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-100 form-select form-select-sm text-secondary bg-white shadow-sm d-flex align-items-center justify-content-between text-start"
            style={{ fontSize: '0.875rem', borderColor: '#dee2e6' }}
          >
            <span className="text-truncate">{selectedLabel}</span>
          </button>

          {isOpen && (
            <ul 
              className="position-absolute start-0 w-100 bg-white border rounded shadow-sm py-1 mt-1 list-unstyled m-0"
              style={{ zIndex: 1050, fontSize: '0.875rem', maxHeight: '200px', overflowY: 'auto' }}
            >
              <li>
                <button
                  type="button"
                  className={`w-100 text-start px-3 py-1.5 border-0 bg-transparent ${filterType === 'all' ? 'fw-bold text-primary' : 'text-secondary'}`}
                  onClick={() => {
                    onFilterChange('all');
                    setIsOpen(false);
                  }}
                >
                  {t('allTypes')}
                </button>
              </li>
              {uniqueTypes.map((type) => (
                <li key={type}>
                  <button
                    type="button"
                    className={`w-100 text-start px-3 py-1.5 border-0 bg-transparent ${filterType === type ? 'fw-bold text-primary' : 'text-secondary'}`}
                    onClick={() => {
                      onFilterChange(type);
                      setIsOpen(false);
                    }}
                  >
                    {type}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}