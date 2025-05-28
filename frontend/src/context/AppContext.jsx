import { SessionProvider } from './SessionContext';
import { TitleProvider } from './TitleContext';

export const AppContext = ({ children }) => {
  return (
    <SessionProvider>
      <TitleProvider>
        {children}
      </TitleProvider>
    </SessionProvider>
  )
};