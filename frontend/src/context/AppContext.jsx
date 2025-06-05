import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './AuthContext';
import { TitleProvider } from './TitleContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

export const AppContext = ({ children }) => {
  const providers = [
    [QueryClientProvider, {client: queryClient}],
    [AuthProvider, {}],
    [TitleProvider, {}],
  ];

  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children
  );
};