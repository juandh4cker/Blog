import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTitle } from '../hooks/useTitle';
import { addPost } from '../api/posts';

import Button from '../components/tags/Button';
import Container from '../components/tags/Container';
import Form from '../components/tags/Form';
import Input from '../components/tags/Input';
import Message from '../components/tags/Message';
import Text from '../components/tags/Text';

const Dashboard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', location: '', imageUrl: '', review: '', rating: ''});
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useTitle(
    "Dashboard",
    "Aquí agregas posts."
  );

  const handleAddPost = async (e) => {
    e.preventDefault();

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setError('La calificación debe estar entre 0 y 10.');
      return;
    } 

    const postData = {
      ...formData,
      rating
    };

    setError('')
    setLoading(true);

    try {
      const response = await addPost(postData);
      navigate(`/post/${response}`);

    } catch (error) {
      setError(`Error al agregar el post: ${error.message || error}`);
      
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <>
      <Container className="max-w-lg">
        <Text variant='title'>Agregar un post</Text>
        <Text variant='subtitle'>Rellena los datos para agregarlos</Text>
        <Form onSubmit={handleAddPost}>
          <Input 
            placeholder="Nombre del post"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input 
            placeholder="Ubicación"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input 
            placeholder="URL de la imagen del post"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <Input
            variant='textarea'
            placeholder="Reseña"
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
          />
          <Input
            variant='rating'
            placeholder="Calificación (0-10)"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          />
          <Button
            type='submit' 
            disabled={loading}
          >
            {"Agregar post"}
          </Button>
          <Button
            variant='secondary'
            onClick={() => navigate(-1)}
          >
            {"Cancelar"}
          </Button>
        </Form>
        {error && <Message error={error} />}
      </Container>
    </>
  );
};

export default Dashboard;