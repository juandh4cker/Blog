import { apiRequest } from './index';

//Access
export const handleLogin = (emailOrUsername, password) => {
  return apiRequest('app/login', 'POST', { 
    'username_or_email': emailOrUsername, 
    'password': password 

  });
}

export const handleRegister = (username, email, password) => {
  return apiRequest('app/register', 'POST', { 
    'username': username, 
    'email': email, 
    'password': password 
  
  });
}

//Token
export const verifyToken = () => apiRequest('app/verify');

// Logout
export const appLogout = () => apiRequest('app/logout', 'POST');