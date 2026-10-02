'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryData } from '@/store/inventorySlice';
import { useSocket } from '@/hooks/useSocket';
import { Shield, Users, Search, Globe, LogOut } from 'lucide-react';
import ClientClock from './ClientClock';
import { useLanguage } from './LanguageContext';

export default function TopMenu() {
  useSocket();

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { activeSessions, isLoaded } = useSelector((state: RootState) => state.inventory);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchInventoryData());
    }
  }, [dispatch, isLoaded]);

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    router.push('/login');
    router.refresh();
  };

  return (
    <header 
      className="bg-white border-bottom shadow-sm sticky-top z-3 d-flex align-items-center justify-content-between justify-content-lg-start px-3 px-md-4 px-lg-5 gap-3"
      style={{ height: '4rem' }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
          style={{ backgroundColor: '#65a30d', width: '2.25rem', height: '2.25rem' }}
        >
          <Shield style={{ width: '1.125rem', height: '1.125rem' }} className="fill-current" />
        </div>
        <span 
          className="d-none d-md-block fw-bold tracking-wider text-uppercase small"
          style={{ color: '#4d7c0f', letterSpacing: '0.05em' }}
        >
          Inventory
        </span>
      </div>

      {/* Search */}
      <div className="position-relative flex-grow-1 ms-lg-5" style={{ maxWidth: '412px' }}>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          disabled
          className="form-control form-control-sm text-secondary fw-bold border pe-5 shadow-sm opacity-75"
          style={{ cursor: 'not-allowed', backgroundColor: '#e9ecef', borderWidth: '1px' }}
        />
        <Search 
          className="text-secondary position-absolute end-0 top-50 translate-middle-y me-3 pe-none" 
          style={{ width: '1rem', height: '1rem' }}
        />
      </div>

      {/* Right side */}
      <div className="d-flex align-items-center justify-content-between gap-2 gap-lg-3 text-secondary flex-shrink-0 ms-lg-auto">
        <div className="d-none d-lg-block">
          <ClientClock />
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          className="btn btn-sm btn-light d-flex align-items-center gap-1.5 px-2 py-1 fw-bold text-dark border-0"
          title="Switch language"
        >
          <Globe style={{ width: '0.875rem', height: '0.875rem' }} />
          <span className="small">{language.toUpperCase()}</span>
        </button>
        
        {/* Active sessions */}
        <div 
          className="d-flex align-items-center gap-1 px-2 py-1 px-md-3 rounded-pill border fw-semibold small text-nowrap"
          style={{ backgroundColor: '#f7fee7', color: '#4d7c0f', borderColor: '#d9f99d' }}
        >
          <Users style={{ width: '0.875rem', height: '0.875rem' }} />
          <span>
            {activeSessions}{' '}
            <span className="d-none d-sm-inline">
              {activeSessions === 1 ? t('activeSessions') : t('activeSessionsPlural')}
            </span>
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-light border d-flex align-items-center justify-content-center p-0"
          style={{ width: '2.25rem', height: '2.25rem' }}
        >
          <LogOut style={{ width: '1.7rem', height: '1.125rem' }} />
        </button>
      </div>
    </header>
  );
}