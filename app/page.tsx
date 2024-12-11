// app/page.tsx
'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/context/Web3AuthContext';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Home() {

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
    </Box>
  );
}