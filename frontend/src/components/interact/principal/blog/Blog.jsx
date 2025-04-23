import React, { useEffect, useState } from 'react';

import { getPosts } from '../../../useful/ApiService';

import DestinationCard from '../../secondary/destinationCard/DestinationCard';

import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setMessage('Cargando destinos...');
      
      try {
        const response = await getPosts();
        setMessage('');
        setPosts(response);

      } catch (error) {
        setMessage(`Error al cargar los posts: ${error.message || error}`);

      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="base-container blog-container">
        <h2 className='base-title'>Destinos Agregados</h2>
        {
          <p className={`base-message ${loading ? 'loading' : 'error'}`}>
            {message}
          </p>
        }
        {!loading && !message && posts.length === 0 && <p>No hay destinos agregados.</p>}
        {!loading && !message && (
          <div className="base-posts-list">
            {posts.map((post) => (
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
    </>
  );  
};

export default Blog;