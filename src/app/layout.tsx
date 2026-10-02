import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Providers } from '@/components/Providers';
import TopMenu from '@/components/TopMenu';
import Navigation from '@/components/Navigation';
import BootstrapClient from '@/components/BootstrapClient';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Inventory App',
  description: 'Orders and Products management',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const isAuthPage = !token;

  return (
    <html lang="ru">
      <body className={`${inter.className} bg-light text-dark min-vh-100 d-flex flex-column`}>
        <BootstrapClient />

        <Providers>
          {!isAuthPage && <TopMenu />}

          <div className="d-flex flex-column flex-lg-row flex-grow-1">
            {!isAuthPage && <Navigation />}

            <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}