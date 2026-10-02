'use client';

import dynamic from 'next/dynamic';

const ChartsContent = dynamic(() => import('@/components/ChartsContent'), {
  ssr: false,
  loading: () => <div className="p-4 text-secondary">Загрузка графиков...</div>,
});

export default function ChartsPage() {
  return <ChartsContent />;
}