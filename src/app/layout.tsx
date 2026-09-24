import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import TopMenu from '@/components/TopMenu';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Inventory App',
  description: 'Orders and Products management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-slate-100 text-gray-800 min-h-screen flex flex-col`}>
        <Providers>
          <TopMenu />
          <div className="flex flex-1">
            <Navigation />
            <main className="flex-1 p-8 overflow-x-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}