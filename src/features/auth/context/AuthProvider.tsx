import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User, LoginRequest, ChangePasswordRequest, AuthContextType } from '../types/auth.types';
import {
  getToken,
  setTokens,
  removeTokens,
  getUser,
  setUser,
  removeUser,
  isTokenExpired,
} from '@/shared/utils/tokenStorage';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner/LoadingSpinner';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        const storedUser = getUser();

        if (token && !isTokenExpired(token) && storedUser) {
          setUserState(storedUser as User);
        } else if (token && isTokenExpired(token)) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await authService.refreshToken({ refreshToken });
              setTokens(response.accessToken, response.refreshToken);
              setUser(response.user);
              setUserState(response.user);
            } else {
              removeTokens();
              removeUser();
            }
          } catch {
            removeTokens();
            removeUser();
          }
        } else {
          removeTokens();
          removeUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeTokens();
        removeUser();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setUserState(response.user);
      toast.success(`Welcome back, ${response.user.fullName}!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeTokens();
      removeUser();
      setUserState(null);
      navigate('/login');
      toast.success('Logged out successfully');
      setIsLoading(false);
    }
  }, [navigate]);

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<void> => {
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
      throw error;
    }
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(user, permission);
  }, [user]);

  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(user, role);
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        changePassword,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;