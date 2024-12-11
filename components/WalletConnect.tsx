// components/WalletConnect.tsx
'use client';

import { useDynamicContext, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { Button, Typography, Box } from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';

export default function WalletConnect() {
  const { user, handleLogOut } = useDynamicContext();

  if (!user) {
    return <DynamicWidget />;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {user.publicKey?.slice(0, 4)}...{user.publicKey?.slice(-4)}
      </Typography>
      <Button
        variant="outlined"
        onClick={handleLogOut}
        size="small"
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
        }}
      >
        Disconnect
      </Button>
    </Box>
  );
}