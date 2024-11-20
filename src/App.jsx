import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';

import Dashboard from './components/Dashboard';
import Blog from './components/blog';
import DestinoDetalle from './components/DestinoDetalle';
import PrivateRoute from './components/PrivateRoute';
import EditDestino from './components/EditDestino';


import Perfil from './components/Perfil';

import './App.css';

const App = () => {
  return (
    <Router basename="/Blog">
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
    </Router>
  );
};

export default App;