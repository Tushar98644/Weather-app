import React from 'react';
import styled from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherProvider } from './contexts/WeatherContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import SearchInput from './components/SearchInput';
import WeatherDisplay from './components/WeatherDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import FavoriteCities from './components/FavoriteCities';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
`;

const ErrorBoundary = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem;
  border: 1px solid #f5c6cb;
`;

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundary>
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened. Please refresh the page and try again.</p>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
        </ErrorBoundary>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WeatherProvider>
            <AppContainer>
              <Header />
              <MainContent>
                <SearchInput />
                <ErrorDisplay />
                <FavoriteCities />
                <WeatherDisplay />
              </MainContent>
            </AppContainer>
          </WeatherProvider>
        </AuthProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
