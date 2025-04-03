import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import ModalsProvider from './core/hooks/modals/modals-context-provider';
import AuthProvider from './core/hooks/auth/auth-context-provider';
import './i18n';
import ErrorSnackbar from './ui/snackbar/error-snackbar';
import InfoSnackbar from './ui/snackbar/info-snackbar';
import Snackbar from './ui/snackbar/snackbar';
import SuccessSnackbar from './ui/snackbar/success-snackbar';
import WarningSnackbar from './ui/snackbar/warning-snackbar';

const defaultTheme = createTheme();
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AuthProvider>
          <SnackbarProvider
            maxSnack={3}
            Components={{
              default: Snackbar,
              error: ErrorSnackbar,
              info: InfoSnackbar,
              success: SuccessSnackbar,
              warning: WarningSnackbar,
            }}
          >
            <ModalsProvider>
              <App />
            </ModalsProvider>
          </SnackbarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
