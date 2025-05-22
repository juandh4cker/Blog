import { apiRequest } from './index';

export const fetchUser = (username) => {
  return apiRequest(`user/${username}`);
};

export const followOrUnfollowUser = (username) => {
  return apiRequest(`user/${username}/follownt`, 'PUT');
};