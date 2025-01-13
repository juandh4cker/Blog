import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Fondo from './components/useful/fondo/Fondo';
import MenuButton from './components/useful/menuButton/MenuButton';
import AppRoutes from './components/useful/AppRoutes';

import './App.css';

const App = () => {
  return (
    <Router basename="/Blog">
      <AppRoutes />
      <Fondo />
      <MenuButton />
    </Router>
  );
};

export default App;
