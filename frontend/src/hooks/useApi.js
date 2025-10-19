import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth, useToast } from './';

import * as api from '@/api';

export const useApi = () => {
  const { auth } = useAuth();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const callWithAuth = (fn) => {
    return (...args) => {
      if (!auth.isAuthenticated) {
        toastError('Unauthorized', 'No esta autorizado para hacer eso');
        return Promise.reject(new Error('Unauthorized'));
      }
      return fn(...args);
    };
  };

  //Mutations
  const createMutation = (
    mutationFn,
    { defaultOnSuccess, defaultOnError, defaultOnSettled } = {},
  ) => {
    return ({
      disableOnSuccess = false,
      disableOnError = false,
      disableOnSettled = false,
      ...options
    } = {}) =>
      useMutation({
        mutationFn,
        onSuccess: (data, variables, context) => {
          if (!disableOnSuccess) {
            defaultOnSuccess?.(data, variables, context);
          }
          options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
          if (!disableOnError) {
            defaultOnError?.(error, variables, context);
          }
          options.onError?.(error, variables, context);
        },
        onSettled: (data, error, variables, context) => {
          if (!disableOnSettled) {
            defaultOnSettled?.(data, error, variables, context);
          }
          options.onSettled?.(data, error, variables, context);
        },
      });
  };

  //Auth
  const login = createMutation(
    ({ usernameOrEmail, password }) => api.apiLogin(usernameOrEmail, password),
    { defaultOnError: (error) => toastError('Error al iniciar sesión', error.message) },
  );

  const register = createMutation(
    ({ username, email, password }) => api.apiRegister(username, email, password),
    { defaultOnError: (error) => toastError('Error al registrarte', error.message) },
  );

  // User
  const fetchUser = (username) =>
    useQuery({
      queryKey: ['user', username],
      queryFn: () => callWithAuth(api.fetchUser)(username),
      retry: 1,
      refetchOnWindowFocus: false,
    });

  const followOrUnfollowUser = createMutation(
    ({ username }) => callWithAuth(api.followOrUnfollowUser)(username),
    {
      defaultOnSuccess: ({ username }) => queryClient.invalidateQueries(['user', username]),
      defaultOnError: (error) => toastError('Error al seguir', error.message),
    },
  );

  //Post
  const fetchPosts = () =>
    useQuery({
      queryKey: ['post'],
      queryFn: () => api.fetchPosts(),
      retry: 1,
      refetchOnWindowFocus: false,
    });

  const fetchPost = (ID) =>
    useQuery({
      queryKey: ['post', ID],
      queryFn: () => callWithAuth(api.fetchPost)(ID),
      retry: 1,
      refetchOnWindowFocus: false,
    });

  const addPost = createMutation((postData) => callWithAuth(api.addPost)(postData), {
    defaultOnSuccess: () => queryClient.invalidateQueries(['posts']),
    defaultOnError: (error) => toastError('Error al crear el post', error.message),
  });

  const editPost = createMutation(({ ID, data }) => callWithAuth(api.editPost)(ID, data), {
    defaultOnSuccess: (data, variables) => {
      const id = variables?.ID ?? variables?.id;
      if (id) {
        queryClient.invalidateQueries(['post', id]);
      }
      queryClient.invalidateQueries(['posts']);
    },
    defaultOnError: (error) => toastError('Error al editar el post', error.message),
  });

  const deletePost = createMutation(({ ID }) => callWithAuth(api.deletePost)(ID), {
    defaultOnSuccess: () => queryClient.invalidateQueries(['posts']),
    defaultOnError: (error) => toastError('Error al eliminar el post', error.message),
  });

  const likePost = createMutation(({ ID }) => callWithAuth(api.likePost)(ID), {
    defaultOnSuccess: (data, variables) => {
      const id = variables?.ID ?? variables?.id ?? data?.ID ?? data?.id;
      if (id) {
        queryClient.invalidateQueries(['post', id]);
      }
    },
    defaultOnError: (error) => toastError('Error al dar like', error.message),
  });

  const addComment = createMutation(
    ({ postID, commentData }) => callWithAuth(api.addComment)(postID, commentData),
    {
      defaultOnSuccess: (data, variables) => {
        const id = variables?.postID;
        if (id) queryClient.invalidateQueries(['post', id]);
      },
      defaultOnError: (error) => toastError('Error al subir el comentario', error.message),
    },
  );

  const deleteComment = createMutation(
    ({ postID, commentID }) => callWithAuth(api.deleteComment)(postID, commentID),
    {
      defaultOnSuccess: (data, variables) => {
        const id = variables?.postID;
        if (id) {
          queryClient.setQueryData(['post', id], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              comments: oldData.comments.filter((c) => c.ID !== variables.commentID),
            };
          });
        }
      },
      defaultOnError: (error) => toastError('Error al eliminar el comentario', error.message),
    },
  );

  return {
    login,
    register,

    fetchUser,
    followOrUnfollowUser,

    fetchPosts,
    fetchPost,
    addPost,
    editPost,
    deletePost,
    likePost,

    addComment,
    deleteComment,
  };
};
