import { apiRequest } from './index';

export const getUser = (username) => apiRequest(`user/${username}`);

export const followOrUnfollowUser = (username) => apiRequest(`user/${username}/follownt`, 'PUT');