from bson import ObjectId
from modules.database import DB as db
from typing import Any, Dict, List, Optional
from modules.utils.generals import creation_date
from modules.users import User_lite

class Comment:
    """
    Representa un comentario en el sistema.

    Attributes:
        ID (int): Identificador único del comentario.
        content (str): Contenido del comentario.
        creator (User_lite): Usuario que creó el comentario.
        rating (int): Calificación del comentario.
        createdAt (str): Fecha de creación en formato ISO 8601.
    """
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Inicializa un comentario con los datos proporcionados.

        Args:
            data (Optional[Dict[str, Any]]): Diccionario con los datos del comentario.
                - ID (int): Identificador único.
                - content (str): Contenido del comentario.
                - creator (User_lite): Objeto del usuario creador.
                - rating (int): Calificación del comentario.
                - createdAt (str): Fecha de creación.
        """
        try:
            self.valid: bool = True
            if not data:
                self.valid = False

            else:
                self.ID: int = int(data["ID"])
                self.content: str = str(data["content"])
                self.creator: User_lite = User_lite(data["creator"])
                self.rating: int = int(data["rating"])
                self.createdAt: str = str(data.get("createdAt")) if data.get("createdAt") else creation_date()
        
        except Exception as e:
            raise ValueError(f"Error al inicializar Comment: {e}")
    
    def __bool__(self) -> bool:
        """Devuelve si la instancia es válida.
        
        Returns:
            valid (bool): Validez de la instancia.
        """
        return self.valid

    def json(self) -> Dict[str, Any]:
        """
        Convierte el comentario en un diccionario JSON.

        Returns:
            Dict[str, Any]: Representación JSON del comentario o {} si falta algún valor.
        """
        try:
            if any(field is None for field in [self.ID, self.content, self.creator, self.rating, self.createdAt]):
                raise ValueError(f"Error al parsear el Comentario: No se proporcionaron datos")
            
            return {
                "ID": self.ID,
                "content": self.content,
                "creator": self.creator.json(),
                "rating": self.rating,
                "createdAt": self.createdAt
            }
        
        except Exception as e:
                raise ValueError(f"Error al parsear el comentario: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        """
        Filtra la información del comentario que debe ser devuelta, dependiendo del usuario que hace la solicitud.

        Args:
            request_user (User_lite): El usuario que hace la solicitud.

        Returns:
            Dict[str, Any]: Diccionario con la información filtrada del comentario, incluyendo el nombre del creador
                            y un campo para indicar si el comentario es editable por el usuario solicitante.
        """
        try:
            returned_comment: Dict[str, Any] = self.json()
            returned_comment["creator"] = self.creator.username
            returned_comment["editable"] = True if request_user == self.creator else False
            return returned_comment

        except Exception as e:
                raise ValueError(f"Error al filtrar el comentario: {e}")


class Post:
    """
    Representa un post en el sistema.

    Attributes:
        _id (ObjectId): Identificador único del post en la base de datos.
        ID (str): Identificador único del post.
        name (str): Nombre del post.
        location (str): Ubicación asociada al post.
        review (str): Reseña o descripción del post.
        rating (float): Calificación del post.
        imageUrl (str): URL de la imagen asociada al post.
        creator (User_lite): Usuario que creó el post.
        comments (list): Lista de comentarios asociados al post.
        createdAt (str): Fecha de creación en formato ISO 8601.
    """
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Inicializa un post con los datos proporcionados.

        Args:
            data (Optional[dict]): Diccionario con los datos del post.
                - _id (ObjectId): Identificador único del post en la base de datos.
                - ID (str): Identificador único del post.
                - name (str): Nombre del post.
                - location (str): Ubicación asociada al post.
                - review (str): Reseña o descripción del post.
                - rating (float): Calificación del post.
                - imageUrl (str): URL de la imagen asociada al post.
                - creator (User_lite): Objeto del usuario creador.
                - comments (list, opcional): Lista de comentarios asociados al post.
                - createdAt (str, opcional): Fecha de creación del post.
        """
        try:
            self.valid: bool = True
            if not data:
                self.valid = False

            else:            
                self._id: ObjectId = ObjectId(data.get("_id"))
                self.ID: int = int(data["ID"])
                self.name: str = str(data["name"])
                self.location: str = str(data["location"])
                self.review: str = str(data["review"])
                self.rating: int = int(data["rating"])
                self.imageUrl: str = str(data["imageUrl"])
                self.creator: User_lite = User_lite(data.get("creator"))
                self.comments: List[Dict[str, Any]] = data.get("comments", [])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error al inicializar Post: {e}")

    def __bool__(self) -> bool:
        """Devuelve si la instancia es válida.
        
        Returns:
            valid (bool): Validez de la instancia.
        """
        return self.valid

    def json(self) -> Dict[str, Any]:
        """
        Convierte el post en un diccionario JSON.

        Returns:
            Dict[str, Any]: Representación JSON del post.
        """        
        
        try:
            if any(field is None for field in [self._id, self.ID, self.name, self.location, self.review, self.rating, self.imageUrl, self.creator, self.comments, self.createdAt]):
                raise ValueError(f"Error al parsear el Post: No se proporcionaron datos")
            
            return {
                "_id": str(self._id),
                "ID": self.ID,
                "name": self.name,
                "location": self.location,
                "review": self.review,
                "rating": self.rating,
                "imageUrl": self.imageUrl,
                "creator": self.creator.json(),
                "comments": self.comments, #[comment.json() for comment in self.comments]
                "createdAt": self.createdAt
            }
        
        except Exception as e:
            raise ValueError(f"Error al parsear el Post: {e}")

    def edit(self, new_info={}) -> Dict[str, Any]:
        """
        Edita la información del post y devuelve solo los valores editados.

        Args:
            new_info (dict): La nueva información a editar.

        Returns:
            dict: Diccionario con solo los valores modificados.
        """
        if not new_info or not self.valid:
            return {}

        edited_fields: Dict[str, Any] = {}
        try:
            valid_fields = {"name", "location", "review", "rating", "imageUrl"}

            for key, value in new_info.items():
                if key in valid_fields and getattr(self, key, None) != value:
                    setattr(self, key, value)
                    edited_fields[key] = value

            return edited_fields

        except Exception as e:
            raise ValueError(f"Error al editar el Post: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        """
        Filtra la información del post que debe ser devuelta, dependiendo del usuario que hace la solicitud.

        Args:
            request_user (User_lite): El usuario que hace la solicitud.

        Returns:
            dict: Diccionario con la información filtrada del post, incluyendo el nombre del creador
                y un campo para indicar si el post es editable por el usuario solicitante.
        """ 
        try:
            returned_post: Dict[str, Any]  = self.json()
            del returned_post["_id"]
            returned_post["creator"] = self.creator.username
            returned_post["editable"] = request_user == self.creator
            returned_post["comments"] = [Comment(comment).filter(request_user) for comment in returned_post["comments"]]
            return returned_post

        except Exception as e:
            return {}
    
    def lite(self) -> Dict[str, Any]:
        """Hace un post mas ligero.
        
        Returns:
            Dict[str, Any]: Post ligero.
        """
        if not self.valid:
            raise ValueError(f"Error al litear el Post: No se proporcionaron datos")
        
        try:
            return {
                "name": self.name,
                "location": self.location,
                "rating": self.rating,
                "imageUrl": self.imageUrl
            }
        except Exception as e:
            raise ValueError(f"Error al litear el post: {e}") from e


class Posts:
    """
    Maneja la gestión de posts en el sistema.
    """
    @classmethod
    def get_posts(cls) -> list:
        """
        Obtiene todos los posts.
        
        Returns:
            list: Todos los posts en la base de datos.
        """
        try:
            db_posts: List[Dict[str, Any]] = db.get_posts()
            posts: List[Dict[str, Any]] = []
            for post in db_posts:
                posts.append(Post(post).lite())
            
            return posts
        
        except Exception as e:
            raise ValueError(f"Error al obtener posts: {e}") from e

    @classmethod
    def get_post(cls, field: str = "ID", value: int | str = "") -> Post:
        """
        Obtiene un post en específico.

        Args:
            field (str): Campo del post del cual se desea buscar.
            value (int | str): Valor del campo que dará una coincidencia.

        Returns:
            Post: Post encontrado o None si no se encuentra.
        """
        try:
            post: Dict[str, Any] = db.get_post(field, value)
            return Post(post)
        
        except Exception as e:
            raise ValueError(f"Error al obtener el post: {e}") from e

    @classmethod
    def get_user_posts(cls, user_posts: list = []) -> list:
        """
        Obtiene los posts de un usuario en específico.

        Args:
            user_posts (list): Lista de los IDs de los posts del usuario.

        Returns:
            List: Lista con los posts encontrados.
        """
        try:
            posts: List[Dict[str, Any]] = []

            for post in user_posts:
                lite: Dict[str, Any] = cls.get_post("ID", post).lite()
                posts.append(lite)
                
            return posts
        
        except Exception as e:
            raise ValueError(f"Error al obtener los posts del usuario: {e}") from e

    @classmethod
    def create_post(cls, name: str, location: str, review: str, rating: int, imageUrl: str, creator: User_lite) -> Post:
        """
        Crea un post.

        Args:
            name (str): Nombre del post.
            location (str): Ubicación asociada al post.
            review (str): Reseña o descripción del post.
            rating (int): Calificación del post.
            imageUrl (str): URL de la imagen asociada al post.
            creator (User): Usuario creador.

        Returns:
            Post: Post creado.
        """
        try:
            ID: int = db.count_posts() + 2 #porque 2?
            new_post: Post = Post({
                "ID": ID,
                "name": name,
                "location": location,
                "review": review,
                "rating": rating,
                "imageUrl": imageUrl,
                "creator": creator.json()
            })
            return new_post if db.add_post(new_post.json(), creator.ID) else Post()
        
        except Exception as e:
            raise ValueError(f"Error al crear el post: {e}") from e
                
    @classmethod
    def edit_post(cls, post: Post, new_data: dict) -> dict:
        """
        Edita un post en específico.

        Args:
            post (Post): Objeto del post del cual se desea editar.
            new_data (dict): Informacion editada del post.

        Returns:
            bool: True si se edita, False si no.
        """
        try:
            edited = post.edit(new_data)
            if edited:
                return edited if db.edit_post(post.ID, edited) else {}
            
            return {}

        except Exception as e:
            raise ValueError(f"Error al editar el post: {e}") from e
    
    @classmethod
    def delete_post(cls, post: Post) -> bool:
        """
        Borra un post en específico.

        Args:
            post (Post): Objeto del post del cual se desea borrar.

        Returns:
            bool: True si se borra, False si no.
        """
        try:
            return db.delete_post(post.ID, post.creator.ID)
        
        except Exception as e:
            raise ValueError(f"Error al borrar el post: {e}") from e
    
    #Comments

    @classmethod
    def get_comments(cls, post: Post, request_user: User_lite = User_lite()) -> list:
        """
        Obtiene todos los comentarios de un post específico.
        
        Args:
            post (Post): Objeto del post del cual se obtendrán los comentarios.
            request_user (User_lite): Usuario que realiza la peticion.
    
        Returns:
            list: Lista de comentarios asociados al post.
        """
        try:
            db_comments: List[Dict[str, Any]] = db.get_comments(post.ID)
            comments: List[Dict[str, Any]] = []
            for comment in db_comments:
                comments.append(Comment(comment).filter(request_user))
            
            return comments
        
        except Exception as e:
            raise ValueError(f"Error al obtener comentarios: {e}") from e    

    @classmethod
    def get_comment(cls, post_id: int, comment_id: int) -> Comment:
        """
        Obtiene un comentario específico de un post.
        
        Args:
            post_id (int): Post donde se añadirá el comentario.
            comment_id (int): ID del comentario a recuperar.
        
        Returns:
            Comment | None: Instancia de Comment si se encuentra, de lo contrario None.
        """
        try:
            comment: Dict[str, Any]  = db.get_comment(post_id, comment_id)
            return Comment(comment)
        
        except Exception as e:
            raise ValueError(f"Error al obtener el comentario: {e}") from e

    @classmethod
    def new_comment(cls, post: Post, content: str, rating: int, creator: User_lite) -> Comment:
        """
        Crea un nuevo comentario en un post.
        
        Args:
            post (Post): Post donde se añadirá el comentario.
            creator (User_lite): Usuario que crea el comentario.
            content (str): Contenido del comentario.
            rating (int): Calificación del comentario.
        
        Returns:
            bool: True si se agrega correctamente, False en caso contrario.
        """
        try:
            new_comment: Comment = Comment({
                "ID": int(f"{post.ID}{db.count_comments(post.ID) + 1}"), #porque 1
                "content": str(content),
                "creator": creator.json(),
                "rating": int(rating)
            })
            return new_comment if db.add_comment(post.ID, new_comment.json()) else Comment()
        
        except Exception as e:
            raise ValueError(f"Error al crear el comentario: {e}") from e
    
    @classmethod
    def delete_comment(cls, post_id: int, comment: Comment) -> bool:
        """
        Elimina un comentario de un post.
        
        Args:
            post_id (int): Post donde se añadirá el comentario.
            comment (Comment): Comentario a eliminar.
        
        Returns:
            bool: True si se eliminó correctamente, False en caso contrario.
        """  
        try: 
            return db.delete_comment(post_id, comment.ID)
        
        except Exception as e:
            raise ValueError(f"Error al eliminar el comentario: {e}") from e