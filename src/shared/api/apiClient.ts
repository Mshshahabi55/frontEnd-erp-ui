import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================
// Environment Configuration
// ============================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// ============================================
// Type Definitions
// ============================================
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  property: string;
  message: string;
}

// ============================================
// Token Storage Functions
// ============================================
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// ============================================
// Axios Instance
// ============================================
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================
// Request Interceptor - Add Token
// ============================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// Response Interceptor - Handle Errors & Refresh
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    // If response follows ApiResponse format, extract data
    if (response.data && 'isSuccess' in response.data) {
      const apiResponse = response.data as ApiResponse;
      if (!apiResponse.isSuccess) {
        return Promise.reject(new Error(apiResponse.message || 'Request failed'));
      }
      response.data = apiResponse.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Token Refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Handle 400 - Validation Errors
    if (error.response?.status === 400) {
      const data = error.response.data as any;
      if (data?.errors) {
        const errors = data.errors;
        if (Array.isArray(errors)) {
          const errorMessage = errors.map((e: any) => `${e.property}: ${e.message}`).join('; ');
          return Promise.reject(new Error(errorMessage));
        } else if (typeof errors === 'object') {
          const errorMessage = Object.keys(errors)
            .map(key => `${key}: ${errors[key].join(', ')}`)
            .join('; ');
          return Promise.reject(new Error(errorMessage));
        }
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      return Promise.reject(new Error('You do not have permission to perform this action'));
    }

    // Handle 404 - Not Found
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }

    // Handle 5xx - Server Errors
    if (error.response?.status && error.response.status >= 500) {
      return Promise.reject(new Error('Internal server error. Please try again later.'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;