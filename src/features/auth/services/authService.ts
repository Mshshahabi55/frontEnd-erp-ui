import { User, LoginRequest, LoginResponse, ChangePasswordRequest } from '../types/auth.types';

// ✅ Mock User برای تست
const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@erp.com',
  firstName: 'Admin',
  lastName: 'User',
  fullName: 'Admin User',
  roles: ['admin'],
  permissions: [
    'view_dashboard',
    'view_customers',
    'create_customers',
    'edit_customers',
    'delete_customers',
    'view_products',
    'create_products',
    'edit_products',
    'delete_products',
    'view_orders',
    'create_orders',
    'edit_orders',
    'delete_orders',
    'view_reports',
    'manage_users',
  ],
  avatar: '',
};

export const authService = {
  /**
   * Mock Login - Accepts any username/password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // ✅ Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ✅ Accept any credentials for testing
    if (credentials.username && credentials.password) {
      return {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: MOCK_USER,
      };
    }

    throw new Error('Invalid credentials');
  },

  /**
   * Refresh token
   */
  refreshToken: async (request: { refreshToken: string }): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      user: MOCK_USER,
    };
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_USER;
  },

  /**
   * Change password
   */
  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
  },

  /**
   * Check permissions
   */
  hasPermission: (user: User | null, permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  },

  /**
   * Check role
   */
  hasRole: (user: User | null, role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  },
};