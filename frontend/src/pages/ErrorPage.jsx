import { useNavigate } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';

const ErrorPage = ({ type = 'Not Found' }) => {
  const navigate = useNavigate();
  useTitle(
    type === 'Unauthorized' ? 'No autorizado' : 'Página no encontrada',
    "Error"
  );
  const message =
    type === 'Unauthorized'
      ? 'No tienes permiso para acceder a esta página.'
      : 'La página que buscas no existe.';

  return (
    <>
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
