import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';
import Results from './components/results';

const App = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('token') ? true : false;
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/results" element={<Results />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
