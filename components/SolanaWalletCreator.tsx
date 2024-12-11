'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function SolanaWalletCreator() {
  const { ready, authenticated } = usePrivy();
  const { wallets, createWallet } = useSolanaWallets();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeWallet = async () => {
      if (!ready || !authenticated || wallets.length > 0) {
        setIsInitializing(false);
        return;
      }

      try {
        await createWallet();
      } catch (error) {
        // 지갑이 이미 있는 경우의 에러는 무시
        if (error?.toString().includes('already has an embedded Solana wallet')) {
          console.log('Solana wallet already exists');
        } else {
          console.error('Failed to create Solana wallet:', error);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeWallet();
  }, [ready, authenticated, wallets.length, createWallet]);

  // 초기화 중에만 로딩 화면 표시
  if (isInitializing && authenticated && wallets.length === 0) {
    return (
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Initializing Wallet...
        </Typography>
        <CircularProgress sx={{ color: '#2AABEE' }} />
      </Box>
    );
  }

  return null;
}