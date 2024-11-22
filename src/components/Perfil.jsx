import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/perfil.css';
import Fondo from './Fondo';
import MenuButton from './MenuButton';
import DestinationCard from './DestinationCard';

const Perfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        setLoading(true);

        const userResponse = await fetch(
          `https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users/${id}`
        );
        if (!userResponse.ok) throw new Error('Error al cargar el perfil del usuario');
        const userData = await userResponse.json();

        const postsResponse = await fetch(
          'https://67253fdfc39fedae05b45582.mockapi.io/api/v1/blogs'
        );
        if (!postsResponse.ok) throw new Error('Error al cargar los posts');
        const postsData = await postsResponse.json();

        const userPosts = postsData.filter((post) => post.creator === userData.name);

        setUsuario(userData);
        setPosts(userPosts);
        setFollowers(userData.followers);

        setIsFollowing(userData.followedBy?.includes(currentUserId) || false);
      } catch (err) {
        console.error(err);
        setError('Hubo un error al cargar el perfil del usuario y sus posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [id, currentUserId]);

  const handleFollowToggle = async () => {
    if (currentUserId === id) return;

    try {
      const isCurrentlyFollowing = usuario.followedBy.includes(currentUserId);

      const updatedFollowedBy = isCurrentlyFollowing
        ? usuario.followedBy.filter((uid) => uid !== currentUserId)
        : [...usuario.followedBy, currentUserId];

      const updatedUser = await fetch(
        `https://67253fdfc39fedae05b45582.mockapi.io/api/v1/users/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...usuario,
            followers: updatedFollowedBy.length,
            followedBy: updatedFollowedBy,
          }),
        }
      ).then((res) => res.json());

      setFollowers(updatedUser.followers);
      setIsFollowing(!isCurrentlyFollowing);
      setUsuario((prev) => ({ ...prev, followedBy: updatedFollowedBy }));
    } catch (err) {
      console.error('Error al actualizar seguidores:', err);
    }
  };

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
          <p>
            <b>Seguidores:</b> {followers}
          </p>
          <p>
            <b>Posts publicados:</b> {posts.length}
          </p>
          {currentUserId !== id && (
            <button
              className={`button follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </button>
          )}
          <button className="button" onClick={() => navigate('/blog')}>
            Regresar al Blog
          </button>
        </div>

        <div className="usuario-posts">
          <h3>Posts del Usuario:</h3>
          {posts.length > 0 ? (
            <ul className="posts-list">
              {posts.map((posts) => (
              <DestinationCard
                key={posts.id}
                id={posts.id}
                name={posts.name}
                location={posts.location}
                imageUrl={posts.imageUrl}
                review={posts.review}
                rating={posts.rating}
              />
              ))}
            </ul>
          ) : (
            <p>Este usuario no ha publicado posts.</p>
          )}
        </div>
      </div>
      <MenuButton />
    </>
  );
};

export default Perfil;
