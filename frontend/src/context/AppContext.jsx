import { AuthProvider } from './AuthContext';
import { ConfigProvider } from './ConfigContext';
import { QueryProvider } from './QueryContext';
import { TitleProvider } from './TitleContext';
import { HeroUIProvider } from './UIContext';

const AppContext = ({ children }) => {
  const providers = [
    [HeroUIProvider, {}],
    [QueryProvider, {}],
    [ConfigProvider, {}],
    [AuthProvider, {}],
    [TitleProvider, {}],
  ];

  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children,
  );
};

export default AppContext;
