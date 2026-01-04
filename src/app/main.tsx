import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routers/AppRouter';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { SessionProvider } from './providers/session-provider';
import './styles/global.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="luigi-theme">
                <SessionProvider>
                    <AppRouter />
                </SessionProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
