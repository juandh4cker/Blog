import { useAuth } from './';
import * as api from '@/api';

export const useApi = () => {
  const { auth, logout } = useAuth();

  const callWithAuth = (apiFn) => {
    return (...args) => {
      if (!auth.isAuthenticated) {
        logout();
        return Promise.reject(new Error("Unauthorized"));
      }
      return apiFn(...args);
    };
  };

  return {
    apiLogin: api.apiLogin,
    apiRegister: api.apiRegister,
    
    fetchUser: callWithAuth(api.fetchUser),
    followOrUnfollowUser: callWithAuth(api.followOrUnfollowUser),

    fetchPosts: api.fetchPosts,
    fetchPost: callWithAuth(api.fetchPost),
    addPost: callWithAuth(api.addPost),
    editPost: callWithAuth(api.editPost),
    deletePost: callWithAuth(api.deletePost),

    addComment: callWithAuth(api.addComment),
    deleteComment: callWithAuth(api.deleteComment),
  };
};