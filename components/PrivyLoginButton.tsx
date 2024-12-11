'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { Box, Button, Typography, Popover } from '@mui/material';
import { AccountBalanceWallet, ExitToApp } from '@mui/icons-material';

export default function PrivyLoginButton() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useSolanaWallets();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const solanaWallet = wallets[0];
  const displayAddress = solanaWallet?.address
    ? `${solanaWallet.address.slice(0, 4)}...${solanaWallet.address.slice(-4)}`
    : 'Loading...';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {authenticated ? (
        <>
          <Button
            onClick={handleClick}
            startIcon={<AccountBalanceWallet />}
            variant="text"
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'background.paper',
              },
            }}
          >
            {displayAddress}
          </Button>
          
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiPopover-paper': {
                backgroundColor: 'background.paper',
                width: 300,
                p: 2,
                mt: 1,
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Solana Wallet Address
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                {solanaWallet?.address || 'Not available'}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Network
              </Typography>
              <Typography variant="body2">
                {process.env.NEXT_PUBLIC_NETWORK || 'mainnet-beta'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body2">
                {user?.email || 'Not available'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Google Account
              </Typography>
              <Typography variant="body2">
                {user?.google?.email || 'Not connected'}
              </Typography>
            </Box>
          </Popover>

          <Button
            onClick={logout}
            variant="contained"
            startIcon={<ExitToApp />}
            sx={{
              background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Logout
          </Button>
        </>
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
          Login with Google
        </Button>
      )}
    </Box>
  );
}