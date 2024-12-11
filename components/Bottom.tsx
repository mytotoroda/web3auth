'use client'
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, SwapHoriz, Send } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Bottom = () => {
  const router = useRouter();
  const [value, setValue] = useState(0);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch(newValue) {
            case 0:
              router.push('/');
              break;
            case 1:
              router.push('/transfer');
              break;
            case 2:
              router.push('/swap');
              break;
          }
        }}
        sx={{ backgroundColor: 'transparent' }}
      >
        <BottomNavigationAction 
          label="Main" 
          icon={<Home />} 
          sx={{ color: 'text.secondary' }}
        />
        <BottomNavigationAction 
          label="Transfer" 
          icon={<Send />} 
          sx={{ color: 'text.secondary' }}
        />
        <BottomNavigationAction 
          label="Swap" 
          icon={<SwapHoriz />} 
          sx={{ color: 'text.secondary' }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Bottom;