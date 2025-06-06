import { QueryProvider } from './QueryContext';
import { AuthProvider } from './AuthContext';
import { TitleProvider } from './TitleContext';

export const AppContext = ({ children }) => {
  const providers = [
    [QueryProvider, {}],
    [AuthProvider, {}],
    [TitleProvider, {}],
  ];

  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children
  );
};