import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ type = 'Not Found' }) => {
  const navigate = useNavigate();

  const title =
    type === 'Unauthorized' ? 'No autorizado' : 'Página no encontrada';
  const message =
    type === 'Unauthorized'
      ? 'No tienes permiso para acceder a esta página.'
      : 'La página que buscas no existe.';

  return (
    <>
      {setTitle(title, title)}
      <div className="base-container">
        <h1 className="base-title">{title}</h1>
        <p className="base-subtitle">{message}</p>

        <div className="buttons-container">
          <button
            className="base-secondary-button"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>

          <button
            className="base-button"
            onClick={() => navigate('/blog')}
          >
            Ir al Blog
          </button>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
