import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { queryClient } from '@/config/react-query.config';
import { theme } from '@/config/theme.config';
import { environment } from '@/config/environment';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  direction: 'ltr',
                  fontFamily: '"Inter", sans-serif',
                },
                success: {
                  iconTheme: { primary: '#2e7d32', secondary: '#ffffff' },
                },
                error: {
                  iconTheme: { primary: '#d32f2f', secondary: '#ffffff' },
                },
              }}
            />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
      {environment.enableDebugTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};