// app/auth-callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AuthCallback() {
  const { handleAuthorizationCallback } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleAuthorizationCallback();
        router.push('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/?error=auth_callback_failed');
      }
    };

    handleCallback();
  }, [handleAuthorizationCallback, router]);

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
        Completing authentication...
      </Typography>
    </Box>
  );
}