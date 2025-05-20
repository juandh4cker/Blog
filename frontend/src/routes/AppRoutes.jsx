import { Route, Routes, Navigate } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import Blog from '../pages/Blog';
import PrivateRoute from './PrivateRoute';
import Dashboard from '../pages/Dashboard';
import Post from '../pages/Post'
import Perfil from '../pages/Perfil';
import EditPost from '../pages/EditPost';
import Logout from '../auth/logout';
import ErrorPage from '../pages/ErrorPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/blog" element={<Blog />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post/:ID" element={<Post />} />
        <Route path="/user/:username" element={<Perfil />} />
        <Route path="/post/:ID/edit" element={<EditPost />} />
      </Route>
      
      <Route path="/logout" element={<Logout />} />
      <Route path="/" element={<Navigate to="/blog" />} />
      <Route path="*" element={<ErrorPage type="Not Found" />} />
    </Routes>
  );
};

export default AppRoutes;