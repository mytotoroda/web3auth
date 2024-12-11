'use client';
import { useEffect } from 'react';
import { useWeb3Auth } from '../context/Web3AuthContext'; // Web3Auth 컨텍스트 사용
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthCallback() {
  const { web3auth, handleCallback } = useWeb3Auth(); // Web3Auth 컨텍스트에서 필요한 항목들을 가져옵니다
  const router = useRouter();

  useEffect(() => {
    const processCallback = async () => {
      try {
        if (!web3auth) {
          throw new Error('web3auth not initialized');
        }
        
        await handleCallback(); // Web3Auth 콜백 처리
        router.push('/');
      } catch (error) {
        console.error('Web3Auth callback error:', error);
        router.push('/?error=auth_callback_failed');
      }
    };

    processCallback();
  }, [web3auth, handleCallback, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2
      }}
    >
      <CircularProgress />
      <Typography>
        Completing Web3Auth authentication...
      </Typography>
    </Box>
  );
}