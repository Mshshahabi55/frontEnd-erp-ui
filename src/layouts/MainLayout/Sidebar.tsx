import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  Settings,
  Assessment,
} from '@mui/icons-material';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Customers', icon: <People />, path: '/customers' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

export const Sidebar = ({ drawerWidth, mobileOpen, onDrawerToggle }: SidebarProps) => {
  const navigate = useNavigate();

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          ERP System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};