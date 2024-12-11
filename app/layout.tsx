// app/layout.tsx
'use client';

import { Box } from '@mui/material';
import { Web3AuthProvider } from '@/context/Web3AuthContext';
import Navbar from '@/components/Navbar';
import Bottom from '@/components/Bottom';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Web3AuthProvider>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar />
            <Box sx={{ pt: 10, pb: 8, px: 2 }}>
              {children}
            </Box>
            <Bottom />
          </Box>
        </Web3AuthProvider>
      </body>
    </html>
  );
}