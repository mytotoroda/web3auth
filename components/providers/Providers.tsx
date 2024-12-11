'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/app/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['google'],
        appearance: {
          theme: 'dark',
          accentColor: '#2AABEE',
        },
        embeddedWallets: { 
          //createOnLogin: 'users-without-wallets'
	  createOnLogin: 'off'  // 자동 생성 비활성화
        },
        wallets: [
          {
            id: 'solana',
            name: 'Solana Wallet',
            chain: 'solana'
          }
        ]
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PrivyProvider>
  );
}