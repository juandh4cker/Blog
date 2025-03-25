from database import database
from comment import Comment
from post import Post
from user import User_lite

class Comments:
    """
    Maneja la gestión de comentarios en el sistema.
    
    Attributes:
        db (Database): Instancia de la base de datos para interactuar con los comentarios.
    """
    def __init__(self):
        """
        Inicializa la clase Comments con una instancia de la base de datos.
        """
        self.__db = database
    
    def get_comments(self, post: Post) -> list:
        """
        Obtiene todos los comentarios de un post específico.
        
        Args:
            post (Post): Objeto del post del cual se obtendrán los comentarios.
        
        Returns:
            list: Lista de comentarios asociados al post.
        """
        comments = self.__db.get_comments(post.ID)
        return comments if comments else {}
    
    def get_comment(self, post_id: int, comment_id: int) -> Comment | None:
        """
        Obtiene un comentario específico de un post.
        
        Args:
            post_id (int): ID del post que contiene el comentario.
            comment_id (int): ID del comentario a recuperar.
        
        Returns:
            Comment | None: Instancia de Comment si se encuentra, de lo contrario None.
        """
        comment = self.__db.get_comment(post_id, comment_id)
        return Comment(comment) if comment else None

    def new_comment(self, post_id: int, content: str, rating: int, creator: User_lite) -> Comment | None:
        """
        Crea un nuevo comentario en un post.
        
        Args:
            post_id (int): ID del post donde se añadirá el comentario.
            creator (User_lite): Usuario que crea el comentario.
            content (str): Contenido del comentario.
            rating (int): Calificación del comentario.
        
        Returns:
            bool: True si se agrega correctamente, False en caso contrario.
        """
        new_comment = Comment({
            "ID": int(f"{post_id}{self.__db.count_comments(post_id) + 1}"),
            "content": str(content),
            "creator": creator.json(),
            "rating": int(rating)
        })
        return new_comment if self.__db.add_comment(post_id, new_comment.json()) else None
    
    def delete_comment(self, post_id: int, comment: Comment) -> bool:
        """
        Elimina un comentario de un post.
        
        Args:
            post_id (int): ID del post que contiene el comentario.
            comment (Comment): Comentario a eliminar.
        
        Returns:
            bool: True si se eliminó correctamente, False en caso contrario.
        """   
        return self.__db.delete_comment(post_id, comment.ID)

comments = Comments()