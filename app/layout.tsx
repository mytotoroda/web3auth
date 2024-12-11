'use client';

import type { Metadata } from 'next';
import Providers from '@/components/providers/Providers';
import SolanaWalletCreator from '@/components/SolanaWalletCreator';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SolanaWalletCreator />
          {children}
        </Providers>
      </body>
    </html>
  );
}