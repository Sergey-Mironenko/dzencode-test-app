'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
  { name: 'ПРИХОД', href: '/orders' },
  { name: 'ГРУППЫ', href: '/groups' },
  { name: 'ПРОДУКТЫ', href: '/products' },
  { name: 'ПОЛЬЗОВАТЕЛИ', href: '/users' },
  { name: 'НАСТРОЙКИ', href: '/settings' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="
      w-full lg:w-64 
      lg:min-h-[calc(100vh-4rem)] 
      bg-slate-50 
      border-b lg:border-b-0 lg:border-r border-gray-200 
      flex flex-col items-center 
      py-4 lg:py-8 
      shadow-sm lg:shadow-[4px_0_24px_rgba(0,0,0,0.08)]
      z-10
    ">
      {/* User profile */}
      <div className="relative mb-4 lg:mb-10 group">
        <div className="relative w-16 h-16 lg:w-24 lg:h-24 overflow-hidden rounded-full border-2 border-gray-200 shadow-md transition-all">
          <Image
            src="/avatar.jpg"
            sizes="(max-width: 1024px) 64px, 96px"
            alt="User avatar"
            fill
            className="object-cover"
            priority
          />
        </div>
        <button 
          aria-label="Profile settings"
          className="absolute bottom-0 right-0 lg:p-1.5 p-1 bg-white rounded-full border border-gray-200 shadow transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-600"
        >
          <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation list */}
      <nav aria-label="Main navigation" className="flex flex-col sm:flex-row flex-wrap lg:flex-col justify-center lg:justify-start gap-1 sm:gap-2 lg:gap-3 items-center w-full px-2 lg:px-0">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative w-auto text-gray-700 sm:w-auto text-center py-2 sm:py-1.5 lg:py-1 px-3 lg:px-2 m-0 
                text-sm sm:text-xs lg:text-sm font-bold tracking-wide transition-colors
                border-b-[3px] rounded-t-sm
                ${isActive 
                  ? 'border-lime-600 lg:bg-transparent' 
                  : 'border-transparent hover:text-lime-600'
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}