import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import App from './app';
import AuthProvider from './core/hooks/auth/auth-context-provider';
import i18n from './i18n';
import ModalsProvider from './ui/modals/modals-provider';
import ToastsProvider from './ui/toasts/toasts-provider';

const defaultTheme = createTheme();
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <I18nextProvider i18n={i18n}>
            <AuthProvider>
              <ToastsProvider>
                <ModalsProvider>
                  <App />
                </ModalsProvider>
              </ToastsProvider>
            </AuthProvider>
          </I18nextProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
