'use client';

import { ChevronDown } from 'lucide-react';

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
  return (
    <div className="flex items-center gap-4 sm:gap-6 md:gap-7 lg:gap-8 mb-6 sm:mb-7 md:mb-8 mt-3 sm:mt-4 pl-2 sm:pl-3 md:pl-4">
      <h1 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold text-gray-800">
        Продукты / {totalCount}
      </h1>

      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
        <label className="text-xs sm:text-sm md:text-sm lg:text-sm text-gray-500 font-medium">
          Тип:
        </label>

        <div className="relative min-w-[150px] sm:min-w-[170px] md:min-w-[185px] lg:min-w-[200px]">
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-2 sm:pl-3 pr-7 sm:pr-8 text-xs sm:text-sm md:text-sm lg:text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Все типы</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}