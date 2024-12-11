'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Navbar from '@/components/Navbar';
import Bottom from '@/components/Bottom';

export default function Home() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<number | null>(null);

  // Get the Solana wallet
  const solanaWallet = wallets[0];

  // Get network and RPC URL from environment variables
  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet-beta';
  const rpcUrl = network === 'mainnet-beta' 
    ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL 
    : process.env.NEXT_PUBLIC_DEVNET_RPC_URL;

  // Initialize Solana connection
  const connection = new Connection(rpcUrl || 'https://api.mainnet-beta.solana.com');

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (solanaWallet?.address) {
        try {
          const walletBalance = await connection.getBalance(new PublicKey(solanaWallet.address));
          setBalance(walletBalance / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error('Error fetching balance:', err);
          setBalance(null);
        }
      }
    };

    if (ready && authenticated && solanaWallet) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [ready, authenticated, solanaWallet, connection]);

  const handleTransfer = async () => {
    if (!solanaWallet?.address) {
      setError('Wallet not connected');
      return;
    }
    
    try {
      setSending(true);
      setError('');

      // 송금 금액을 lamports로 변환
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // 전송 내용을 메시지로 작성
      const message = `Transfer ${amount} SOL to ${recipient}`;
      
      try {
        // 먼저 사용자에게 서명 요청
        const messageBytes = new TextEncoder().encode(message);
        const { signature } = await solanaWallet.signMessage(messageBytes);
        console.log('Transaction signed:', signature);

        // 서명이 성공하면 트랜잭션 실행
        const recipientPubKey = new PublicKey(recipient);
        const senderPubKey = new PublicKey(solanaWallet.address);

        // Create transfer instruction
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: senderPubKey,
            toPubkey: recipientPubKey,
            lamports,
          })
        );

        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderPubKey;

        // Send transaction
        const signedTx = await solanaWallet.signTransaction(transaction);
        const txSignature = await connection.sendRawTransaction(signedTx.serialize());
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction({
          signature: txSignature,
          blockhash,
          lastValidBlockHeight,
        });

        if (confirmation.value.err) {
          throw new Error('Transaction failed');
        }

        setRecipient('');
        setAmount('');
        alert(`Transaction successful!\nSignature: ${txSignature}`);
        
      } catch (signError) {
        if (signError.toString().includes('User rejected')) {
          setError('Transaction cancelled by user');
        } else {
          setError('Failed to sign transaction');
        }
        console.error('Signature error:', signError);
        return;
      }

    } catch (err) {
      console.error('Transaction error:', err);
      setError('Transaction failed. Please check the address and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      <Box sx={{ pt: 10, pb: 8, px: 2 }}>
        <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Your Solana Wallet ({network})
              </Typography>
              {ready && authenticated ? (
                <>
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {solanaWallet?.address || 'No wallet connected'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Balance
                    </Typography>
                    <Typography variant="h6">
                      {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography>Please connect your wallet</Typography>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Send Solana
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Transfer SOL to another wallet
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Recipient Address"
                  variant="outlined"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={sending}
                />
                
                <TextField
                  fullWidth
                  label="Amount (SOL)"
                  type="number"
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={sending}
                  inputProps={{ step: '0.001', min: '0' }}
                />

                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleTransfer}
                  disabled={!ready || !authenticated || !solanaWallet || !recipient || !amount || sending}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
                  }}
                >
                  {sending ? 'Sending...' : 'Send SOL'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      <Bottom />
    </Box>
  );
}