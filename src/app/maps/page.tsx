'use client';

import dynamic from 'next/dynamic';

const MapContent = dynamic(() => import('@/components/MapContent'), {
  ssr: false,
  loading: () => <div className="p-4 text-secondary">Загрузка карты...</div>,
});

export default function MapsPage() {
  return <MapContent />;
}