import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Login from './../access/login/Login';
import Register from './../access/register/Register';
import Dashboard from './../interact/principal/dashboard/Dashboard';
import Blog from './../interact/principal/blog/Blog';
import DestinoDetalle from './../interact/secondary/destinoDetalle/DestinoDetalle';
import EditDestino from './../interact/secondary/editDestino/EditDestino';
import PrivateRoute from './../useful/PrivateRoute';
import Perfil from './../interact/principal/perfil/Perfil';
import Logout from './logout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blog" element={<Blog />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/post/:ID" 
        element={
          <PrivateRoute>
            <DestinoDetalle />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/user/:username" 
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/post/:ID/edit" 
        element={
          <PrivateRoute>
            <EditDestino />
          </PrivateRoute>
        } 
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;