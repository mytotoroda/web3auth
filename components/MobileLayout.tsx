'use client';

import { useState } from 'react';
import { 
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  SwapHoriz as SwapIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PrivyLoginButton from './PrivyLoginButton';  // DynamicWidget 대신


interface MobileLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Swap', icon: <SwapIcon />, path: '/' },
  { text: 'Wallet', icon: <WalletIcon />, path: '/wallet' },
  { text: 'History', icon: <HistoryIcon />, path: '/history' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const DynamicWalletButton = () => {
  const { user } = useDynamicContext();

  return (
    <Box sx={{ 
      '& .dynamic-widget': {
        background: 'transparent',
        border: 'none',
      },
      '& .dynamic-widget-button': {
        padding: '8px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
        color: 'white',
        fontWeight: 500,
        fontSize: '0.875rem',
        '&:hover': {
          opacity: 0.9,
        }
      }
    }}>
      <DynamicWidget />
    </Box>
  );
};

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItem 
        button 
        selected={pathname === item.path}
        sx={{
          my: 0.5,
          borderRadius: '8px',
          mx: 1,
          '&.Mui-selected': {
            backgroundColor: 'background.hover',
            '&:hover': {
              backgroundColor: 'background.hover',
            },
          },
        }}
      >
        <ListItemIcon 
          sx={{ 
            color: pathname === item.path ? 'primary.main' : 'text.secondary',
            minWidth: '40px'
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.text} 
          primaryTypographyProps={{
            sx: { 
              color: pathname === item.path ? 'primary.main' : 'text.primary',
              fontWeight: pathname === item.path ? 500 : 400
            }
          }}
        />
      </ListItem>
    </Link>
  );

  const DesktopNav = () => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {menuItems.map((item) => (
        <Link 
          key={item.text} 
          href={item.path}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <IconButton 
            color={pathname === item.path ? "primary" : "inherit"}
            sx={{ 
              borderRadius: '8px',
              p: 1.2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            {item.icon}
          </IconButton>
        </Link>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(36, 47, 61, 0.95)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 500,
                background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Raydium Swap
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && <DesktopNav />}
            <Box sx={{ ml: 2 }}>
               <PrivyLoginButton />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ pt: 2, pb: 1.5, px: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              background: 'linear-gradient(45deg, #2AABEE 30%, #45CEE0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Raydium Swap
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'divider' }} />
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <MenuItem key={item.text} item={item} />
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          pb: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        <Container 
          maxWidth="sm" 
          sx={{ 
            mt: 2,
            height: '100%'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MobileLayout;