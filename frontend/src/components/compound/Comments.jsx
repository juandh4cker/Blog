import React, { useRef } from 'react';

import { useApi, useNav } from '@/hooks';
import { commentSchema } from '@/schema';
import { ratingStars, timeSince } from '@/utils';
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Form,
  Input,
  Modal,
  Text,
  UserCard,
} from '@/components';

const Comments = ({ comments, postID, setOnOpen }) => {
  const { addComment } = useApi();
  const formRef = useRef();

  const addCommentMutation = addComment({
    onSuccess: () => {
      if (formRef.current) {
        formRef.current.reset({ content: '', rating: '' });
      }
    },
  });

  return (
    <Modal setOnOpen={setOnOpen} isDivided size="xl" scrollBehavior="inside">
      <Modal.Header className="flex flex-col gap-1">{'Comentarios'}</Modal.Header>

      <Modal.Body className="h-[50vh]">
        {!comments?.length ? (
          <Text>{'No hay comentarios agregados'}</Text>
        ) : (
          <div className="w-full flex flex-col justify-center">
            {comments.map((comment, index) => (
              <React.Fragment key={comment.ID}>
                <Comment postID={postID} comment={comment} />
                {index < comments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Form
          ref={formRef}
          isSubmitting={addCommentMutation.isPending}
          schema={commentSchema}
          onSubmit={(data) => addCommentMutation.mutate({ postID, commentData: data })}
        >
          <Input
            name="content"
            kind="textarea"
            placeholder="Escribe tu comentario aquí"
            label={null}
            minRows={1}
          />
          <div className="flex flex-row gap-2 w-full">
            <Input
              name="rating"
              kind="rating"
              placeholder="Calificación (0-10)"
              label={null}
              className="w-2/3"
            />
            <Button
              type="submit"
              kind="primary"
              size="sm"
              isLoading={addCommentMutation.isPending}
              className="w-1/3"
            >
              {'Enviar'}
            </Button>
            <Modal.CloseButton size="sm" className="w-1/3" />
          </div>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

const Comment = ({ postID, comment }) => {
  const { deleteComment } = useApi();
  const { navUser } = useNav();

  const deleteCommentMutation = deleteComment();

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      deleteCommentMutation.mutate({ postID, commentID: comment.ID });
    }
  };

  const items = [
    {
      key: 'uploaded',
      children: `Subido hace ${timeSince(comment.createdAt)}`,
      props: { isDisabled: true },
    },
    {
      key: 'profile',
      children: 'Ir al perfil',
      props: { onClick: () => navUser(comment.creator) },
    },
    {
      key: 'delete',
      children: deleteCommentMutation.isPending ? 'Eliminando...' : 'Borrar',
      props: {
        onClick: handleDelete,
        className: 'text-danger',
        color: 'danger',
        disabled: deleteCommentMutation.isPending,
      },
    },
  ];

  return (
    <Container shadow="none" className="w-full">
      <Container.Body className="flex flex-col justify-between w-full items-center">
        <div className="flex flex-row justify-between w-full items-center">
          <UserCard
            kind="comment"
            user={comment.creator}
            description={ratingStars(comment.rating)}
          />

          <Dropdown backdrop="blur">
            <Dropdown.Trigger>
              <Button>{'☰'}</Button>
            </Dropdown.Trigger>

            {items.map((item) => (
              <Dropdown.Item key={item.key} {...item.props}>
                {item.children}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>

        <Text className="whitespace-pre-wrap break-words text-start pl-2 w-full h-full">
          {comment.content}
        </Text>
      </Container.Body>
    </Container>
  );
};

export default Comments;
