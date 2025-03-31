from modules.posts import Comment, Post, Posts
from typing import Any, Dict
from modules.users import User, Users, User_lite
from modules.utils.generals import check_password, is_valid_username, is_valid_email, is_valid_password, is_valid_image
from modules.utils.log import Log
from modules.utils.token import Token
import modules.utils.exceptions as exceptions

class App:
    """
    Clase principal de la aplicación que maneja operaciones de acceso, registro,
    gestión de usuarios, posts, comentarios y verificación de tokens.
    """
    Log.info("Application initialized.")
    
    #Access

    @staticmethod
    def login(username_or_email: str, password: str) -> dict:
        """
        Realiza el inicio de sesión del usuario validando sus credenciales.

        Args:
            username_or_email (str): Correo electrónico o nombre de usuario.
            password (str): Contraseña del usuario.

        Returns:
            dict: Diccionario con el token y el nombre de usuario si es exitoso, 
                  o un diccionario de error en caso contrario.
        """
        try:
            if not username_or_email or (not is_valid_username(username_or_email) and not is_valid_email(username_or_email)):
                raise exceptions.InvalidCredential("Username or email")

            if not password or not is_valid_password(password):
                raise exceptions.InvalidCredential("Password")

            user: User = Users.get_user("username", username_or_email.capitalize()) or Users.get_user("email", username_or_email.lower())

            if user:
                if check_password(password, user.password):
                    Log.info(f"User {user.ID} logged in")
                    return {"username": user.username, "token": user.token()}

                raise exceptions.IncorrectCredential(user.ID)

            else:
                raise exceptions.NotFound("user")
        
        except Exception as e:
            raise exceptions.GeneralError(data="Error logging the user", error=str(e), log=f"{{username_or_email: {username_or_email}, password: {password}}}") from e
    
    @staticmethod
    def register(username: str, email: str, password: str) -> dict: 
        """
        Registra un nuevo usuario en el sistema.

        Args:
            username (str): Nombre de usuario.
            email (str): Correo electrónico.
            password (str): Contraseña.

        Returns:
            dict: Diccionario con el token y el nombre de usuario si el registro es exitoso,
                  o un diccionario de error en caso contrario.
        """
        try:
            if not username or not is_valid_username(username):
                raise exceptions.InvalidCredential("username")
            
            if not email or not is_valid_email(email):
                raise exceptions.InvalidCredential("email")
            
            if not password or not is_valid_password(password):
                raise exceptions.InvalidCredential("password")
            
            username = username.capitalize()
            email = email.lower()

            if Users.get_user("username", username):
                raise exceptions.AlreadyInUse("username")
            
            if Users.get_user("email", email):
                raise exceptions.AlreadyInUse("email")

            user: User = Users.create_user(username, email, password)

            if user:
                Log.info(f"User {user.ID} created and logged in")
                return {"username": user.username, "token": user.token()}

            raise exceptions.GeneralError("Error creating the user")
        
        except Exception as e:
            raise exceptions.GeneralError(data=f"Error creating the user", error=str(e), log=f"{{username: {username}, email: {email}, password: {password}}}") from e
    
    #Users

    @staticmethod
    def get_user(username: str, request_user: dict) -> dict:
        """
        Obtiene y filtra la información de un usuario en función de la solicitud.

        Args:
            username (str): Nombre de usuario a buscar.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            dict: Información filtrada del usuario o un diccionario vacío si no se encuentra.
        """
        try:
            request_User: User_lite = User_lite(request_user)
            user: User = Users.get_user("username", username.capitalize())

            if user:
                Log.info(f"User {user.ID} fetched by User {request_User.ID}")
                return user.filter(request_User)

            raise exceptions.NotFound("user")
        
        except Exception as e:
            raise exceptions.GeneralError("Error fetching the user", str(e), username) from e
    
    #Follows

    @staticmethod
    def follownt(following_username: str, request_user: dict) -> bool:
        """
        Permite a un usuario seguir o dejar de seguir a otro.

        Args:
            following_username (str): Nombre del usuario a seguir o dejar de seguir.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si se ejecutó.
        """
        try:
            follower: User_lite = User_lite(request_user)
            following: User = Users.get_user("username", following_username)
            
            if follower == following:
                raise exceptions.GeneralError("No puedes seguirte a ti mismo")

            if following:
                if follower.ID not in following.followers:
                    if Users.follow(following, follower):
                        Log.info(f"User {following.ID} followed by {follower.ID}")
                        return True
                    
                    raise exceptions.GeneralError(data="Error al seguir al usuario", log=f"{follower.ID} to {following.ID}")

                else:
                    if Users.unfollow(following, follower):
                        Log.info(f"User {following.ID} unfollowed by {follower.ID}")
                        return True
                    
                    raise exceptions.GeneralError(data="Error al dejar de seguir al usuario", log=f"{follower.ID} to {following.ID}")
            
            raise exceptions.NotFound("user")
        
        except Exception as e:
            raise exceptions.GeneralError("Error al seguir o no", str(e), f"{following.ID} follownt by {follower.ID}") from e
        
    #Posts

    @staticmethod
    def get_posts(request_user: dict) -> list:
        """
        Obtiene todos los Posts.

        Args:
            request_user (dict | opcional): Usuario que realiza la solicitud.

        Returns:
            list: Lista de Posts.
            request_user (dict): Usuario que realiza la solicitud.
        """
        try:
            request_User: User_lite = User_lite(request_user)
            Log.info(f"All posts fetched by {request_User.ID if request_User else 'invited'}")
            return Posts.get_posts()
        
        except Exception as e:
            raise exceptions.GeneralError("Error al obtener los posts", str(e)) from e

    @staticmethod
    def get_post(post_id: int, request_user: dict) -> dict:
        """
        Obtiene y filtra un post específico.

        Args:
            post_id(int): ID del post.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            dict: Información filtrada del post o un diccionario vacío si no se encuentra.
        """
        try:
            request_User: User_lite = User_lite(request_user)
            post: Post = Posts.get_post("ID", post_id)
            
            if post:
                Log.info(f"Post {post.ID} fetched by {request_User.ID}")
                return post.filter(request_User)
            
            raise exceptions.NotFound("post")
        
        except Exception as e:
            raise exceptions.GeneralError("Error al obtener post", str(e), str(post_id)) from e
    
    @staticmethod
    def create_post(name: str, location: str, review: str, rating: int, imageUrl: str, creator: dict) -> int:
        """
        Crea un nuevo post.

        Args:
            name (str): Nombre del post.
            location (str): Ubicación del post.
            review (str): Reseña del post.
            rating (int): Calificación del post.
            imageUrl (str): URL de la imagen del post.
            creator (dict): Información del creador del post.

        Returns:
            int: ID del post creado.
        """
        try:
            if rating < 0 or rating > 10:
                raise ValueError("Rating inválido")

            if not is_valid_image(imageUrl):
                raise ValueError("Imagen inválida")

            request_User: User_lite = User_lite(creator)
            post: Post = Posts.create_post(name.capitalize(), location.capitalize(), review.capitalize(), rating, imageUrl, request_User)
            
            if post:
                Log.info(f"Post {post.ID} created")
                return post.ID
            
            Log.error(f"Error creating the post {post.json()}")
            raise exceptions.GeneralError("Error al crear el post")
        
        except Exception as e:
            raise exceptions.GeneralError("Error al crear el post", str(e)) from e
    
    @staticmethod
    def edit_post(post_id: int, name: str, location: str, review: str, rating: int, imageUrl: str, request_user: dict) -> bool:
        """
        Edita un post existente.

        Args:
            post_id (int): ID del post a editar.
            name (str): Nuevo nombre del post.
            location (str): Nueva ubicación.
            review (str): Nueva reseña.
            rating (int): Nueva calificación.
            imageUrl (str): Nueva URL de la imagen.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si se editó, False si no.
        """
        try:
            request_User: User_lite = User_lite(request_user)
            post: Post = Posts.get_post("ID", post_id)

            new_data: dict = {}
            if name:
                new_data["name"] = name
            
            if location: 
                new_data["location"] = location

            if review: 
                new_data["review"] = review

            if rating and rating != 0: 
                rating = int(rating)
                if rating < 0 or rating > 10:
                    raise ValueError("Rating inválido")
                new_data["rating"] = rating

            if imageUrl: 
                if not is_valid_image(imageUrl):
                    raise ValueError("Imagen inválida")
                new_data["imageUrl"] = imageUrl

            if not new_data:
                return True

            if post:
                if request_User != post.creator:
                    raise exceptions.Unauthorized()
                
                edited: dict = Posts.edit_post(post, new_data)
                if edited is not None:
                    Log.info(f"Post {post.ID} edited {{original: {post.json()}, edit: {edited}}}")
                return True

            Log.error(f"Error editing the post {post_id}, new_data: {new_data}")
            raise exceptions.GeneralError("Error al editar el Post")
        
        except Exception as e:
            raise exceptions.GeneralError("Error al editar el post", str(e)) from e
    
    @staticmethod
    def delete_post(post_id: int, request_user: dict) -> bool:
        """
        Elimina un post.

        Args:
            post_id (int): ID del post a eliminar.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si el post se eliminó, False en caso contrario.
        """
        try:
            request_User: User_lite = User_lite(request_user)
            post: Post = Posts.get_post("ID", post_id)
            if post:
                if request_User != post.creator:
                    raise exceptions.Unauthorized()
                
                deleted: bool = Posts.delete_post(post)

                if deleted:
                    Log.info(f"Post {post.ID} deleted {{original: {post.json()}}}")
                    return deleted
            
            Log.error(f"Error deleting post {{post.json()}}")
            raise exceptions.GeneralError("Error al borrar el post")
         
        except Exception as e:
            raise exceptions.GeneralError("Error al borrar el post", str(e)) from e
    
    #Comments

    @staticmethod
    def new_comment(post_id: int, content: str, rating:int, request_user: dict) -> bool:
        """
        Agrega un nuevo comentario a un post.

        Args:
            post_id (int): ID del post.
            content (str): Contenido del comentario.
            rating (int): Calificación del comentario.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si se agregó, False si no
        """
        try:
            if rating < 0 or rating > 10:
                raise ValueError("Rating inválido")
            
            creator: User_lite = User_lite(request_user)
            post: Post = Posts.get_post("ID", post_id)
            comment: Comment = Posts.new_comment(post, content, rating, creator)

            if comment:
                Log.info(f"Comment {comment.ID} created by {creator.ID} in {post_id}")
                return True
            
            Log.error(f"Error al crear el comentario {{content: {content}, rating: {rating}}} en el post {post_id} por el usuario {creator.ID}")
            raise exceptions.GeneralError("Error al crear el comentario")
        
        except Exception as e:
            raise exceptions.GeneralError("Error al crear el comentario", str(e)) from e
    
    @staticmethod
    def delete_comment(post_id: int, comment_id: int, request_user: dict) -> bool:
        """
        Elimina un comentario de un post.

        Args:
            post_id (int): ID del post.
            comment_id (int): ID del comentario a eliminar.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si el comentario se eliminó, False en caso contrario.
        """
        try:
            request_User: User_lite = User_lite(request_user)
            comment: Comment = Posts.get_comment(post_id, comment_id)

            if comment:
                if request_User != comment.creator:
                    raise exceptions.Unauthorized()
                deleted: bool = Posts.delete_comment(post_id, comment)

                if deleted:
                    Log.info(f"Comentario eliminado {{original: {comment.json()}}}")
                    return deleted
                
                Log.info(f"Error al eliminar el comentario {comment.json()}")
                raise exceptions.GeneralError("Error al borrar el comentario")

            raise exceptions.NotFound("comment")
        
        except Exception as e:
            raise exceptions.GeneralError("Error al borrar el comentario", str(e)) from e
    
    #Token

    @staticmethod
    def verify_token(request_token: str) -> dict:
        """
        Verifica la validez de un token.

        Args:
            request_token (str): Token a verificar.

        Returns:
            dict: Diccionario con la información del token.
        """
        try:
            valid: Dict[str, Any] = Token.is_valid(request_token)
            return valid
        
        except Exception as e:
            raise exceptions.GeneralError("Error al verificar el token", str(e)) from e