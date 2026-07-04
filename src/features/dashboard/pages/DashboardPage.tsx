import { Grid, Paper, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Chip, Divider } from '@mui/material';
import {
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Receipt,
  Warning,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';

// ============================================
// آمارهای اصلی داشبورد
// ============================================
const stats = [
  {
    title: 'Total Customers',
    value: '1,234',
    icon: <People />,
    color: '#1976d2',
    change: '+12%',
    trend: 'up'
  },
  {
    title: 'Total Products',
    value: '567',
    icon: <Inventory />,
    color: '#2e7d32',
    change: '+5%',
    trend: 'up'
  },
  {
    title: 'Total Orders',
    value: '89',
    icon: <ShoppingCart />,
    color: '#ed6c02',
    change: '-3%',
    trend: 'down'
  },
  {
    title: 'Revenue',
    value: '$12,345',
    icon: <AttachMoney />,
    color: '#9c27b0',
    change: '+18%',
    trend: 'up'
  },
];

// ============================================
// فعالیت‌های اخیر (Mock Data)
// ============================================
const recentActivities = [
  {
    id: 1,
    type: 'order',
    title: 'New Order #1234',
    description: 'John Doe placed a new order',
    time: '2 minutes ago',
    status: 'pending',
    icon: <Receipt />,
  },
  {
    id: 2,
    type: 'customer',
    title: 'New Customer Registered',
    description: 'Jane Smith created an account',
    time: '15 minutes ago',
    status: 'completed',
    icon: <People />,
  },
  {
    id: 3,
    type: 'product',
    title: 'Low Stock Alert',
    description: 'Product "Laptop Pro" is running low',
    time: '1 hour ago',
    status: 'warning',
    icon: <Warning />,
  },
  {
    id: 4,
    type: 'order',
    title: 'Order #1230 Completed',
    description: 'Order was delivered successfully',
    time: '3 hours ago',
    status: 'completed',
    icon: <CheckCircle />,
  },
  {
    id: 5,
    type: 'product',
    title: 'New Product Added',
    description: 'Product "Wireless Mouse" was added',
    time: '5 hours ago',
    status: 'completed',
    icon: <Inventory />,
  },
];

// ============================================
// سفارشات اخیر (Mock Data)
// ============================================
const recentOrders = [
  { id: '#1234', customer: 'John Doe', total: '$245.00', status: 'pending', date: '2024-01-15' },
  { id: '#1233', customer: 'Jane Smith', total: '$189.50', status: 'completed', date: '2024-01-15' },
  { id: '#1232', customer: 'Bob Johnson', total: '$432.00', status: 'shipped', date: '2024-01-14' },
  { id: '#1231', customer: 'Alice Brown', total: '$76.25', status: 'completed', date: '2024-01-14' },
  { id: '#1230', customer: 'Charlie Wilson', total: '$512.75', status: 'cancelled', date: '2024-01-13' },
];

// ============================================
// کامپوننت اصلی DashboardPage
// ============================================
export const DashboardPage = () => {
  // تابع برای دریافت رنگ وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'shipped': return 'info';
      case 'cancelled': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  // تابع برای دریافت متن وضعیت
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'shipped': return 'Shipped';
      case 'cancelled': return 'Cancelled';
      case 'warning': return 'Warning';
      default: return status;
    }
  };

  return (
    <Box>
      {/* ===== Header ===== */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* ===== Stats Cards ===== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    {stat.trend === 'up' ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.trend === 'up' ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      vs last month
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ===== Recent Activities & Quick Actions ===== */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Activities
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                View All <ArrowForward sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 1.5,
                      '&:hover': { bgcolor: 'action.hover', borderRadius: 1 },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: `${activity.status === 'warning' ? '#ed6c02' : activity.status === 'completed' ? '#2e7d32' : '#1976d2'}15`,
                          color: activity.status === 'warning' ? '#ed6c02' : activity.status === 'completed' ? '#2e7d32' : '#1976d2',
                          display: 'flex',
                        }}
                      >
                        {activity.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.title}
                          </Typography>
                          <Chip
                            label={getStatusText(activity.status)}
                            size="small"
                            color={getStatusColor(activity.status) as any}
                            sx={{ height: 20, fontSize: '0.625rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions & Recent Orders */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={1}>
              {['Add Customer', 'New Order', 'Add Product', 'View Reports'].map((action) => (
                <Grid size={{ xs: 6 }} key={action}>
                  <Paper
                    sx={{
                      p: 1.5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {action}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Orders Summary */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Orders
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                View All <ArrowForward sx={{ fontSize: 16 }} />
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {recentOrders.slice(0, 3).map((order) => (
              <Box key={order.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {order.customer}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.total}
                    </Typography>
                    <Chip
                      label={getStatusText(order.status)}
                      size="small"
                      color={getStatusColor(order.status) as any}
                      sx={{ height: 20, fontSize: '0.625rem' }}
                    />
                  </Box>
                </Box>
                {order.id !== recentOrders[2].id && <Divider sx={{ mt: 1.5 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;