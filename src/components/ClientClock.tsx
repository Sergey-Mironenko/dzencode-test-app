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

  if (!time) return <div style={{ width: '8rem', height: '2rem' }} />;

  return (
    <div className="d-flex flex-column align-items-start">
      <span className="text-capitalize fw-medium text-muted" style={{ fontSize: '0.75rem' }}>
        {format(time, 'EEEE', { locale: ru })}
      </span>
      <div className="d-flex align-items-center gap-4 fw-medium">
        <span style={{ width: '110px' }}>{format(time, 'dd MMM, yyyy', { locale: ru })}</span>
        <div className="d-flex align-items-center gap-2 fw-medium" style={{ width: '90px' }}>
          <Clock className="text-success fw-bold" style={{ width: '1 rem', height: '0.875rem' }} />
          <span style={{ minWidth: '65px' }}>
            {format(time, 'HH:mm:ss')}
          </span>
        </div>
      </div>
    </div>
  );
}