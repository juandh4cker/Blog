import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { editPost, getPost, setTitle } from '../../../useful/ApiService';

import Button from '../../../elements/Button';
import Container from '../../../elements/Container';
import Form from '../../../elements/Form';
import Input from '../../../elements/Input';
import Message from '../../../elements/Message';
import Text from '../../../elements/Text';
import Textarea from '../../../elements/Textarea';

const EditPost = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [formData, setFormData] = useState({ name: '', location: '', imageUrl: '', review: '', rating: ''});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(ID);
        if (!data.editable) {
          navigate(`/post/${ID}`);
        }

        setFormData(data);

      } catch (error) {
        setError(`Error al editar el post: ${error.message || error}`);

      } finally {
        setLoading(false);

      }
    };
    
    fetchPost();
  }, [ID]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      setError('La calificación debe estar entre 0 y 10.');
      return;
    }

    const updatedPost = {
      ...formData,
      rating,
    };

    setError('')
    setLoading(true);

    try {
      await editPost(ID, updatedPost);
      navigate(`/post/${ID}`);

    } catch (error) {
      setError(`Error al actualizar el post: ${error.message || error}`);

    } finally {
      setLoading(false);

    }
  };

  return (
    <>
      {setTitle(formData.name, "Edicion del post")}
      <Container className="max-w-lg">
        <Text variant='title'>Editar Post</Text>
        <Text variant='subtitle'>Edita los detalles del post</Text>
        <Form onSubmit={handleUpdatePost}>
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
          <Textarea
            placeholder="Reseña"
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
          />
          <Input
            type='number'
            min="0"
            max="10"
            step="0.1"
            placeholder="Calificación (0-10)"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          />
          <Button
            type='submit' 
            disabled={loading}
          >
            {"Editar post"}
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

export default EditPost;