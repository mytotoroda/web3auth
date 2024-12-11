// components/Web3AuthButton.tsx
'use client'

import { Button, CircularProgress, Box, Typography } from '@mui/material';
import { useWeb3Auth } from '@/context/Web3AuthContext';

export const Web3AuthButton = () => {
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    login, 
    disconnect 
  } = useWeb3Auth();

  if (isLoading) {
    return (
      <Button
        variant="contained"
        disabled
        sx={{
          minWidth: '140px',
          color: 'white',
          backgroundColor: 'primary.main',
          '&:hover': { backgroundColor: 'primary.dark' }
        }}
      >
        <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
        연결 중...
      </Button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {user.name}
        </Typography>
        <Button
          variant="contained"
          onClick={disconnect}
          sx={{
            color: 'white',
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' }
          }}
        >
          {`${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`}
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      onClick={login}
      sx={{
        minWidth: '140px',
        color: 'white',
        backgroundColor: 'primary.main',
        '&:hover': { backgroundColor: 'primary.dark' }
      }}
    >
      지갑 연결
    </Button>
  );
};