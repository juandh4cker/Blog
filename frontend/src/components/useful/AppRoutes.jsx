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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/blog" 
        element={
          <PrivateRoute>
            <Blog />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/destino/:id" 
        element={
          <PrivateRoute>
            <DestinoDetalle />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/perfil/:id" 
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/editar-destino/:id" 
        element={
          <PrivateRoute>
            <EditDestino />
          </PrivateRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;