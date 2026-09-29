'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useSocket } from '@/hooks/useSocket';
import { Shield, Users, Search } from 'lucide-react';
import ClientClock from './ClientClock';

export default function TopMenu() {

  // Initialize socket connection
  useSocket();
  const activeSessions = useSelector((state: RootState) => state.inventory.activeSessions);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-sm sticky top-0 z-20 gap-4">
      
      {/* Logo */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-lime-600 flex items-center justify-center text-white shadow-md transition-all">
          <Shield className="w-4 h-4 md:w-5 md:h-5 fill-current" />
        </div>
        <span className="hidden md:block font-extrabold text-lime-700 tracking-wider text-sm uppercase">
          Inventory
        </span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-[412px]">
        <input
          type="text"
          placeholder="Поиск"
          className="w-full bg-gray-100 text-gray-700 font-bold text-sm rounded-md py-1.5 pl-3 pr-8 shadow-[0_-1px_3px_rgba(0,0,0,0.28)] focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
        />
        <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 text-gray-600 justify-between lg:w-[334px] lg:gap-6 lg:text-sm shrink-0">
        <div className="hidden lg:block">
          <ClientClock />
        </div>
        
        <div className="flex items-center gap-1.5 bg-lime-50 text-lime-700 px-2 py-1 md:px-3 md:py-1 rounded-full border border-lime-200 font-semibold text-xs whitespace-nowrap">
          <Users className="w-3.5 h-3.5" />
          <span>
            {activeSessions}{' '}
            <span className="hidden sm:inline">
              {activeSessions === 1 ? 'сессия' : 'сессий'}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}