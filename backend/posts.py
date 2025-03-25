from database import database
from post import Post
from user import User_lite

class Posts:
    """
    Maneja la gestión de posts en el sistema.
    
    Attributes:
        db (Database): Instancia de la base de datos.
    """
    def __init__(self):
        """
        Inicializa la clase Posts con una instancia de la base de datos.
        """
        self.__db = database 

    def get_posts(self, request_user: User_lite = User_lite()) -> list:
        """
        Obtiene todos los posts.
        
        Args:
            request_user (User_lite): Usuario que realiza la peticion.

        Returns:
            list: Todos los posts en la base de datos.
        """
        db_posts = self.__db.get_posts()
        posts = []
        for post in db_posts:
            posts.append(Post(post).filter(request_user))
        
        return posts

    def get_post(self, field: str = "ID", value: int | str = None) -> Post | None:
        """
        Obtiene un post en específico.

        Args:
            field (str): Campo del post del cual se desea buscar.
            value (int | str): Valor del campo que dará una coincidencia.

        Returns:
            Post | None: Post encontrado o None si no se encuentra.
        """
        post = self.__db.get_post(field, value)
        return Post(post) if post else None
    
    def get_user_posts(self, user_posts: list) -> list:
        """
        Obtiene los posts de un usuario en específico.

        Args:
            user_posts (list): Lista de los IDs de los posts del usuario.

        Returns:
            List: Lista con los posts encontrados.
        """
        posts = []

        if user_posts:
            for post in user_posts:
                posts.append(self.get_post("ID", post))
            
            return posts
        return []

    def create_post(self, name: str, location: str, review: str, rating: int, imageUrl: str, creator: User_lite) -> Post:
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
        ID = self.__db.count_posts() + 2
        data = {
            "ID": ID,
            "name": name,
            "location": location,
            "review": review,
            "rating": rating,
            "imageUrl": imageUrl,
            "creator": creator.json()
        }
        new_post = Post(data)
        return new_post if self.__db.add_post(new_post.json(), creator.ID) else None
                
    def edit_post(self, post: Post, new_data: dict) -> bool:
        """
        Edita un post en específico.

        Args:
            post (Post): Objeto del post del cual se desea editar.
            new_data (dict): Informacion editada del post.

        Returns:
            bool: True si se edita, False si no.
        """
        edited = post.edit(new_data)
        if edited != "same":
            return edited if self.__db.edit_post(post.ID, edited) else None 
        return edited
    
    def delete_post(self, post: Post) -> bool:
        """
        Borra un post en específico.

        Args:
            post (Post): Objeto del post del cual se desea borrar.

        Returns:
            bool: True si se borra, False si no.
        """
        return self.__db.delete_post(post.ID, post.creator.ID)
    
posts = Posts()