import { useContext } from 'react';

import { SessionContext } from '../context/SessionContext';

const useAuth = () => useContext(SessionContext);

export default useAuth;