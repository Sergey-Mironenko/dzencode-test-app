'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, User } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const NAV_LINKS = [
    { name: t('navOrders'), href: '/orders' },
    { name: t('navGroups'), href: '/groups' },
    { name: t('navProducts'), href: '/products' },
    { name: t('navCharts'), href: '/charts' },
    { name: t('navMaps'), href: '/maps' },
  ];

  return (
    <aside
      className="navigation-sidebar w-100 bg-light border-bottom border-secondary-subtle d-flex flex-column align-items-center py-3 py-lg-4 shadow-sm position-relative z-1 flex-grow-1"
    >
      {/* User profile */}
      <div className="position-relative mb-3 mb-lg-5">
        <div
          className="position-relative overflow-hidden rounded-circle border border-2 border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center bg-secondary-subtle"
          style={{
            width: '5rem',
            height: '5rem',
          }}
        >
          {!imgError ? (
            <img
              src="/avatar.jpg"
              alt={t('userAvatar')}
              className="w-100 h-100 object-fit-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <User
              className="text-secondary"
              style={{
                width: '2rem',
                height: '2rem',
              }}
            />
          )}
        </div>

        <button
          type="button"
          aria-label={t('profileSettings')}
          className="position-absolute bottom-0 end-0 p-1 p-lg-2 bg-white rounded-circle border border-secondary-subtle shadow-sm d-flex align-items-center justify-content-center"
          style={{
            width: '2rem',
            height: '2rem',
          }}
        >
          <Settings
            className="text-secondary"
            style={{
              width: '0.875rem',
              height: '0.875rem',
            }}
          />
        </button>
      </div>

      {/* Navigation list */}
      <nav
        aria-label="Main navigation"
        className="d-flex flex-column flex-sm-row flex-wrap flex-lg-column justify-content-center justify-content-lg-start gap-1 gap-sm-2 gap-lg-3 align-items-center w-100 px-2 px-lg-0"
      >
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`navigation-link position-relative text-decoration-none text-center py-2 py-sm-1 py-lg-1 px-3 px-lg-2 m-0 fw-bold ${
                isActive
                  ? 'navigation-link-active'
                  : 'text-secondary'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}