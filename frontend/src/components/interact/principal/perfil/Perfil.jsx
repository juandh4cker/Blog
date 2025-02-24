import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { apiRequest, fetchDestino, fetchUsers, followUser } from '../../../useful/ApiService';

import DestinationCard from '../../secondary/destinationCard/DestinationCard';

import './Perfil.css';

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
        const userData = await apiRequest(`users/${id}`);
        const userPosts = await fetchUsers(id);
        const userPost = [];
        
        for (let i = 0; i < userPosts.posts.length; i++) {
          const post = await fetchDestino(userPosts.posts[i]);
          userPost.push(post);
        }

        setUsuario(userData);
        setPosts(userPost);
        setFollowers(userData.followers);
        setIsFollowing(userData.isFollowing);

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

    try {
      setIsFollowing(await followUser(usuario.username));
      const newFollowers = await apiRequest(`users/${id}`)
      setFollowers(newFollowers.followers);

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
      <div className="perfil-usuario">
        <div className="usuario-info">
          <h2 className="usuario-name">{usuario.username}</h2>
          <p>
            <b>Seguidores:</b> {followers}
          </p>
          <p>
            <b>Posts publicados:</b> {posts.length}
          </p>
          {usuario.isFollowing !== "yourself" && (
            <button
              className={`button follow-button ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? 'Dejar de seguir' : 'Seguir'}
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
    </>
  );
};

export default Perfil;