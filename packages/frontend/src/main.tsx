import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { SessionProvider } from './core/hooks/session/session-context';
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
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <SessionProvider>
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
            <App />
          </SnackbarProvider>
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
