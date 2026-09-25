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
    <div className="flex flex-col items-end">
      <span className="capitalize font-medium text-xs text-gray-500">
        {format(time, 'EEEE', { locale: ru })}
      </span>
      <div className="flex items-center gap-2 font-medium">
        <span>{format(time, 'dd MMM, yyyy', { locale: ru })}</span>
        <span className="flex items-center text-lime-600 gap-1 font-semibold">
          <Clock className="w-3.5 h-3.5" />
          {format(time, 'HH:mm:ss')}
        </span>
      </div>
    </div>
  );
}