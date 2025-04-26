// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Fondo from './components/useful/fondo/Fondo';
import MenuButton from './components/useful/menuButton/MenuButton';
import AppRoutes from './components/useful/AppRoutes';
import AuthChecker from './components/useful/AuthChecker';

import './App.css';

const App = () => {
  return (
    <Router basename="/Blog">
      <AuthChecker>
        <AppRoutes />
        <Fondo />
        <MenuButton />
      </AuthChecker>
    </Router>
  );
};

export default App;
