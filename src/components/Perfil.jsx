import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/perfil.css';
import Fondo from './Fondo';

const Perfil = () => {
  const { id } = useParams(); // ID del usuario a mostrar
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setLoading(true);
        // Obtener información del usuario
        const userResponse = await fetch(`https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users/${id}`);
        if (!userResponse.ok) throw new Error('Error al cargar el perfil del usuario');
        const userData = await userResponse.json();

        // Obtener posts del usuario
        const postsResponse = await fetch('https://67253fdfc39fedae05b45582.mockapi.io/api/v1/blogs');
        if (!postsResponse.ok) throw new Error('Error al cargar los posts');
        const postsData = await postsResponse.json();

        const userPosts = postsData.filter((post) => post.creator === userData.name);

        setUsuario(userData);
        setPosts(userPosts);
      } catch (err) {
        console.error(err);
        setError('Hubo un error al cargar el perfil del usuario y sus posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [id]);

  if (loading) {
    return <p className="loading-message">Cargando perfil...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!usuario) {
    return <p className="error-message">El usuario no existe.</p>;
  }

  return (
    <>
      <Fondo />
      <div className="perfil-usuario">
        <div className="usuario-info">
          <h2 className="usuario-name">{usuario.name}</h2>
          <p><b>Posts publicados:</b> {posts.length}</p>
          <button className="button" onClick={() => navigate('/blog')}>Regresar al Blog</button>
        </div>

        <div className="usuario-posts">
          <h3>Posts del Usuario:</h3>
          {posts.length > 0 ? (
            <ul className="posts-list">
              {posts.map((post) => (
                <li key={post.id} className="post-item">
                  <img src={post.imageUrl} alt={post.name} className="post-image" />
                  <h4 className="post-title">{post.name}</h4>
                  <p className="post-location"><b>Ubicación:</b> {post.location}</p>
                  <p className="post-review"><b>Reseña:</b> {post.review}</p>
                  <p className="post-rating"><b>Calificación:</b> {post.rating}/10</p>
                  <button
                    className="button"
                    onClick={() => navigate(`/destino/${post.id}`)}
                  >
                    Ver más
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Este usuario no ha publicado posts.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;
