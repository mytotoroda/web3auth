// components/Navbar.tsx
'use client'

import { AppBar, Toolbar, Button, Box } from '@mui/material';
import Link from 'next/link';
import { Web3AuthButton } from '@/components/Web3AuthButton';

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: 'text.primary',
                '&:hover': { backgroundColor: 'background.hover' }
              }}
            >
              Main
            </Button>
          </Link>
          <Link href="/swap" style={{ textDecoration: 'none' }}>
            <Button
              sx={{
                color: 'text.primary',
                '&:hover': { backgroundColor: 'background.hover' }
              }}
            >
              Swap
            </Button>
          </Link>
        </Box>
        
        <Web3AuthButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;