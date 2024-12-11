// app/page.tsx
'use client';

import { useState } from 'react';
import { useWeb3Auth } from '@/context/Web3AuthContext';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Home() {
  const { connected, publicKey, provider, balance } = useWeb3Auth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet-beta';

  const handleTransfer = async () => {
    if (!provider || !publicKey) {
      setError('지갑이 연결되지 않았습니다');
      return;
    }
    
    try {
      setSending(true);
      setError('');

      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      const message = `${amount} SOL을 ${recipient}로 전송`;
      
      try {
        // 메시지 서명
        const messageBytes = new TextEncoder().encode(message);
        await provider.signMessage(messageBytes);

        const recipientPubKey = new PublicKey(recipient);
        const senderPubKey = new PublicKey(publicKey);

        // 트랜잭션 생성
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: senderPubKey,
            toPubkey: recipientPubKey,
            lamports,
          })
        );

        // 최근 블록해시 가져오기
        const { blockhash } = await provider.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderPubKey;

        // 트랜잭션 서명 및 전송
        const signedTx = await provider.signTransaction(transaction);
        const txSignature = await provider.connection.sendRawTransaction(
          signedTx.serialize()
        );
        
        await provider.connection.confirmTransaction(txSignature);

        setRecipient('');
        setAmount('');
        alert(`전송 성공!\n서명: ${txSignature}`);
        
      } catch (signError: any) {
        if (signError.toString().includes('User rejected')) {
          setError('사용자가 트랜잭션을 취소했습니다');
        } else {
          setError('트랜잭션 서명 실패');
        }
        console.error('서명 오류:', signError);
        return;
      }

    } catch (err) {
      console.error('트랜잭션 오류:', err);
      setError('트랜잭션 실패. 주소를 확인하고 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Solana 지갑 ({network})
          </Typography>
          {connected ? (
            <>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  주소
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {publicKey || '지갑이 연결되지 않음'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  잔액
                </Typography>
                <Typography variant="h6">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : '로딩 중...'}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography>지갑을 연결해주세요</Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Solana 전송
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            다른 지갑으로 SOL 전송하기
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="받는 주소"
              variant="outlined"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={sending}
            />
            
            <TextField
              fullWidth
              label="금액 (SOL)"
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
              disabled={!connected || !recipient || !amount || sending}
              sx={{
                mt: 2,
                background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
              }}
            >
              {sending ? '전송 중...' : 'SOL 전송'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}