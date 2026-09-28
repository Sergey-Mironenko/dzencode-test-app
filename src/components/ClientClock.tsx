'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Clock } from 'lucide-react';

export default function ClientClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <div className="w-32 h-8" />;

  return (
    <div className="flex flex-col items-start">
      <span className="capitalize font-medium text-xs text-gray-500">
        {format(time, 'EEEE', { locale: ru })}
      </span>
      <div className="flex items-center gap-5 font-medium">
        <span className='w-[100px]'>{format(time, 'dd MMM, yyyy', { locale: ru })}</span>
        <span className="flex items-center gap-2 font-medium w-[90px]">
          <Clock className="w-3.5 h-3.5 text-lime-600 font-bold" />
          {format(time, 'HH:mm:ss')}
        </span>
      </div>
    </div>
  );
}