import { Route, Routes } from 'react-router-dom';

import Welcome from '@/pages/Welcome';
import Blog from '@/pages/Blog';
import PrivateRoute from './PrivateRoute';
import Dashboard from '@/pages/Dashboard';
import Post from '@/pages/Post'
import User from '@/pages/User';
import EditPost from '@/pages/EditPost';
import ConfigPage from '@/pages/ConfigPage';
import ErrorPage from '@/pages/ErrorPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/welcome' element={<Welcome />} />
      <Route path='/welcome/register' element={<Welcome inRegister={true} />} />
      <Route path='/' element={<Blog />} />

      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/post/:ID' element={<Post />} />
        <Route path='/user/:username' element={<User />} />
        <Route path='/post/:ID/edit' element={<EditPost />} />
        <Route path='/config' element={<ConfigPage />} />
      </Route>

      <Route path='*' element={<ErrorPage error='Not found' />} />
    </Routes>
  );
};

export default AppRoutes;