import React, { useRef } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApi, useNav, useToast } from '@/hooks';
import { commentSchema } from '@/schema';
import { ratingStars, timeSince } from '@/utils';

import { Divider, Form, FormField, Button, Text, Message, Modal, Container, UserCard } from "./ui";

const Comments = ({ comments, postID, setOnOpen }) => {
  const { addComment } = useApi();
  const { toastError } = useToast();
  const formRef = useRef();
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: (commentData) => addComment(postID, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postID]);
      if (formRef.current) {
        formRef.current.reset({ content: '', rating: '' });
      };
    },
    onError: (error) => {
      toastError("Error al subir el comentario", error.message);
    },
  });
  
  return (
    <Modal setOnOpen={setOnOpen} isDivided size='xl' scrollBehavior='inside' >
      <Modal.Header className="flex flex-col gap-1">Comentarios</Modal.Header>

      <Modal.Body className='h-[50vh]'>
        {(!comments?.length)
          ? <Message>{'No hay comentarios agregados'}</Message>
          : (
            <div className='w-full flex flex-col justify-center'>
              {comments.map((comment, index) => (
                <React.Fragment key={comment.ID}>
                  <Comment
                    postID={postID}
                    comment={comment}
                  />
                  {index < comments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          )
        }
      </Modal.Body>

      <Modal.Footer>
        <Form
          defaultValues={{ content: '', rating: '' }} ref={formRef}
          schema={commentSchema} onSubmit={addCommentMutation.mutate} isSubmitting={addCommentMutation.isPending}
        >
          <FormField name='content' variant='textarea' placeholder='Escribe tu comentario aquí' label={null} minRows={1} />
            <div className='flex flex-row gap-2 w-full'>
              <FormField name='rating' variant='rating' placeholder='Calificación (0-10)' label={null} className='w-2/3' />
              <Button type='submit' variant='submitForm' size='sm' isLoading={addCommentMutation.isPending} className='w-1/3'>{'Enviar'}</Button>
              <Modal.CloseButton size='sm' className='w-1/3' />
            </div>
        </Form>
      </Modal.Footer>
    </Modal>
  )
};

const Comment = ({ postID, comment, toggleExpand }) => {
  const { deleteComment } = useApi();
  const { navUser } = useNav();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const deleteCommentMutation = useMutation({
    mutationFn: () => deleteComment(postID, comment.ID),
    onSuccess: () => {
      queryClient.setQueryData(['post', postID], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          comments: oldData.comments.filter(c => c.ID !== comment.ID)
        };
      });
    },
    onError: (error) => {
      toastError("Error al eliminar el comentario", error.message);
    },
  });

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      deleteCommentMutation.mutate();
    }
  };

  const dropdownItems = [
    {onClick: null, key:"since", text: `Subido hace ${timeSince(comment.createdAt)}`, props: {isDisabled: true}},
    {onClick: () => navUser(comment.creator), key:"profile", text: 'Ir al perfil', props: {}},
    {onClick: handleDelete, key:"delete", text: deleteCommentMutation.isPending ? 'Eliminando...' : 'Borrar', props: {className: 'text-danger', color:'danger', disabled: deleteCommentMutation.isPending}}, 
  ]

  return (
    <Container shadow='none' className='w-full'>
      <Container.Body>
        <div className="flex flex-row justify-between w-full items-center">
          <UserCard user={comment.creator} description={ratingStars(comment.rating)} descriptionClassName='text-yellow-300'/>
          
          <Button variant="dropdown" 
            backdrop='blur'
            triggerProps={{size:'sm', color:'primary', variant:'solid'}}
            triggerContent={'☰'}
            items={dropdownItems}
          />
        </div>

        <Text className='whitespace-pre-wrap break-words text-start pl-2' onClick={toggleExpand}>
          {comment.content}
        </Text>
      </Container.Body>
    </Container>
  );
};

export default Comments;