import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'tailwindcss/tailwind.css';
import { theme } from '../styles/mui-theme';
import { ThemeProvider } from '@mui/material/styles';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <div suppressHydrationWarning>
          {typeof window === 'undefined' ? null : <Component {...pageProps} />}
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
