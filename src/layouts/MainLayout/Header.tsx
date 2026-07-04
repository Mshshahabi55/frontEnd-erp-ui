import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Button } from '@mui/material';
import { Menu as MenuIcon, Logout, Person, Settings } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

export const Header = ({ drawerWidth, onDrawerToggle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ERP Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {user?.fullName}
          </Typography>
          
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};