import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { queryClient } from '@/config/react-query.config';
import { theme } from '@/config/theme.config';
import { environment } from '@/config/environment';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* ✅ اضافه شده */}
        <BrowserRouter>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
      {environment.enableDebugTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};