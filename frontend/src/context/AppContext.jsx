import { AuthProvider } from './AuthContext';
import { ConfigProvider } from './ConfigContext';
import { QueryProvider } from './QueryContext';
import { TitleProvider } from './TitleContext';

const AppContext = ({ children }) => {
  const providers = [
    [QueryProvider, {}],
    [ConfigProvider, {}],
    [AuthProvider, {}],
    [TitleProvider, {}],
  ];

  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children
  );
};

export default AppContext;