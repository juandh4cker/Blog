import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { followntUser, getUser } from '../../../useful/ApiService';

import DestinationCard from '../../secondary/destinationCard/DestinationCard';

import './Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUsuario] = useState(null);
  const [postsLength, setPostsLength] = useState([]);
  const [isSelf, setIsSelf] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUser = async (load=true) => {
    try {
      if (load) {
        setLoading(true);
      }
      const userData = await getUser(username);
      setUsuario(userData);
      setPostsLength(userData.posts.length);

      if (userData.hasOwnProperty("isFollowing")) {
        setIsSelf(false)
        setIsFollowing(userData.isFollowing);

      } else {
        setIsSelf(true)

      }

    } catch (error) {
      setMessage(`Error al cargar el perfil: ${error.message || error}`);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(true);
  }, [username]);

  const handleFollowToggle = async () => {

    try {
      await followntUser(username)
      await fetchUser(false)

    } catch (error) {
      setMessage(`Error al seguir: ${error.message || error}`);
    }
  };

  if (loading) {
    return <p className="base-message loading">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="base-message error">El user no existe.</p>;
  }

  return (
    <>
      <div className="base-container perfil-usuario">
        <div className="user-info">
          <h2 className="base-title">{user.username}</h2>
          <p className='base-subtitle'>
            <b>Seguidores:</b> {user.followers}
          </p>
          <p className='base-subtitle'>
            <b>Posts publicados:</b> {postsLength}
          </p>
          <div className='buttons-container'>
            {!isSelf && (
              <button
                className={`base-small-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Dejar de seguir' : 'Seguir'}
              </button>
            )}
            <button className="base-small-button" onClick={() => navigate('/blog')}>
              Regresar al Blog
            </button>
          </div>
        </div>
        {postsLength !== 0 && <h2 className='base-title'>Posts del usuario</h2>}
        <div className="user-posts">
          {
            <p className={`base-message ${loading ? 'loading' : 'error'}`}>
              {message}
            </p>
          }
          {!loading && !message && postsLength === 0 && <p>No hay destinos agregados.</p>}
          {!loading && !message && (
            <div className="base-posts-list">
              {user.posts.map((post) => (
                <DestinationCard
                  key={post.ID}
                  ID={post.ID}
                  name={post.name}
                  location={post.location}
                  imageUrl={post.imageUrl}
                  rating={post.rating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;