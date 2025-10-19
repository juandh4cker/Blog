import { apiRequest } from './api';

//Access
export const apiLogin = (emailOrUsername, password) => {
  return apiRequest('app/login', 'POST', {
    username_or_email: emailOrUsername,
    password: password,
  });
};

export const apiRegister = (username, email, password) => {
  return apiRequest('app/register', 'POST', {
    username: username,
    email: email,
    password: password,
  });
};

//Token
export const apiCheckToken = () => {
  return apiRequest('app/verify');
};

// Logout
export const apiLogout = () => {
  return apiRequest('app/logout', 'POST');
};
