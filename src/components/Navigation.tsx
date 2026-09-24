'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'ПРИХОД', href: '/orders' },
    { name: 'ГРУППЫ', href: '/groups' },
    { name: 'ПРОДУКТЫ', href: '/products' },
    { name: 'ПОЛЬЗОВАТЕЛИ', href: '/users' },
    { name: 'НАСТРОЙКИ', href: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col items-center py-8 min-h-[calc(100vh-4rem)]">
      {/* User profile */}
      <div className="relative mb-10 group cursor-pointer">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-md relative">
          <Image
            src="/avatar.jpg"
            alt="User Avatar"
            fill
            className="object-cover"
            priority
          />
        </div>
        <button className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow hover:bg-gray-50 transition">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation list */}
      <nav className="w-full flex flex-col items-center gap-3">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-bold tracking-wide transition-colors py-1 relative ${
                isActive
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-700 hover:text-emerald-600'
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