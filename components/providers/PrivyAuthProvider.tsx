//components/providers/PrivyAuthProvider.tsx
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Box, Button } from '@mui/material';

export default function PrivyLoginButton() {
  const { login, logout, authenticated, user } = usePrivy();

  return (
    <Box>
      {authenticated ? (
        <Button
          onClick={logout}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
        </Button>
      ) : (
        <Button
          onClick={login}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}