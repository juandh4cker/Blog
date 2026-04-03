import { Blog, ConfigPage, Dashboard, EditPost, Post, User, Welcome } from '@/pages';
import { Menu, Error } from '@/components';

export const routes = [
  {
    key: 'welcome',
    path: '/welcome',
    element: <Welcome />,
    auth: ['all'],
  },
  {
    key: 'register',
    path: '/welcome/register',
    element: <Welcome inRegister={true} />,
    auth: ['all'],
  },
  {
    key: 'menu',
    element: <Menu />,
    auth: ['all'],
    children: [
      {
        key: 'blog',
        path: '/',
        element: <Blog />,
        auth: ['all'],
      },
      {
        key: 'dashboard',
        path: '/dashboard',
        element: <Dashboard />,
        auth: ['private'],
      },
      {
        key: 'post',
        path: '/post/:ID',
        element: <Post />,
        auth: ['private'],
      },
      {
        key: 'user',
        path: '/user/:username',
        element: <User />,
        auth: ['private'],
      },
      {
        key: 'edit',
        path: '/post/:ID/edit',
        element: <EditPost />,
        auth: ['private'],
      },
      {
        key: 'config',
        path: '/config',
        element: <ConfigPage />,
        auth: ['private'],
      },
      {
        key: 'other',
        path: '*',
        element: <Error page />,
        auth: ['all'],
      },
    ],
  },
];
