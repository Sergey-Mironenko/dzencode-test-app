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
    <header className="h-16 bg-white border-b border-gray-200 grid grid-cols-[288px_1fr_324px] pl-[200px] pr-[190px] items-center shadow-sm sticky top-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lime-600 flex items-center justify-center text-white shadow-md">
          <Shield className="w-5 h-5 fill-current" />
        </div>

        <span className="font-extrabold text-lime-700 tracking-wider text-sm uppercase">
          Inventory
        </span>
      </div>

      {/* Search */}
      <div className="relative w-[412px]">
        <input
          type="text"
          placeholder="Поиск"
          className="w-full bg-gray-100 text-gray-700 font-bold text-sm rounded-md py-1.5 pl-3 pr-8 shadow-[0_-1px_3px_rgba(0,0,0,0.28)]"
        />

        <Search className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5" />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6 text-sm text-gray-600 justify-between w-[334px]">
        <ClientClock />
        <div className="flex items-center gap-1.5 bg-lime-50 text-lime-700 px-3 py-1 rounded-full border border-lime-200 font-semibold text-xs">
          <Users className="w-3.5 h-3.5" />
          <span>{activeSessions} {activeSessions === 1 ? 'сессия' : 'сессий'}</span>
        </div>
      </div>
    </header>
  );
}