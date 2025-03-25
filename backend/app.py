from bcrypt import checkpw
from comments import comments
from jwtoken import jwtoken
from log import log
from posts import posts
from re import compile, match
from users import users
from user import User_lite
import requests

#Manejo de errores

class App:
    """
    Clase principal de la aplicación que maneja operaciones de acceso, registro,
    gestión de usuarios, posts, comentarios y verificación de tokens.
    """
    def __init__(self):
        """
        Se registra en el log el inicio de la aplicación.
        """
        log.info("Application initialized.")

    #Methods

    def __is_valid_username(self, username: str) -> bool:
        """
        Valida el formato del nombre de usuario.

        Args:
            username (str): Nombre de usuario a validar.

        Returns:
            bool: True si el nombre de usuario es válido, False de lo contrario.
        """
        pattern = r"^[a-zA-Z0-9._]+[a-zA-Z0-9_]$"
        return bool(match(pattern, username))

    def __is_valid_email(self, email: str) -> bool:
        """
        Valida el formato del correo electrónico.

        Args:
            email (str): Correo electrónico a validar.

        Returns:
            bool: True si el correo electrónico es válido, False de lo contrario.
        """
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(match(pattern, email))
    
    def __is_valid_password(self, password: str) -> bool:
        """
        Valida que la contraseña tenga al menos 8 caracteres, incluyendo mayúsculas,
        minúsculas y dígitos.

        Args:
            password (str): Contraseña a validar.

        Returns:
            bool: True si la contraseña es válida, False de lo contrario.
        """
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
        return bool(match(pattern, password))
    
    def is_valid_image_url(self, url: str) -> bool:
        """
        Verifica si una URL es válida y apunta a una imagen real.

        Args:
            url (str): URL a verificar.

        Returns:
            bool: True si la URL es válida y contiene una imagen, False en caso contrario.
        """
        url_regex = compile(
            r"^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$"
        )

        if not url_regex.fullmatch(url):
            return False

        if not url.startswith(("http://", "https://")):
            url = "https://" + url

        try:
            response = requests.get(url, stream=True, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
            
            if response.status_code != 200:
                return False

            content_type = response.headers.get("Content-Type", "")
            if content_type.startswith("image/"):
                return True

            first_bytes = response.raw.read(10)
            image_signatures = [b"\xff\xd8", b"\x89PNG", b"GIF87a", b"GIF89a"]  # JPEG, PNG, GIF
            return any(first_bytes.startswith(sig) for sig in image_signatures)

        except requests.RequestException:
            return False

    #Access

    def login(self, email_or_username: str, password: str) -> dict:
        """
        Realiza el inicio de sesión del usuario validando sus credenciales.

        Args:
            email_or_username (str): Correo electrónico o nombre de usuario.
            password (str): Contraseña del usuario.

        Returns:
            dict: Diccionario con el token y el nombre de usuario si es exitoso, 
                  o un diccionario de error en caso contrario.
        """
        if not (self.__is_valid_email(email_or_username) or self.__is_valid_username(email_or_username) or self.__is_valid_password(password)):
            return {"error": "Credenciales inválidas"}

        user = users.get_user("username", email_or_username.capitalize()) or self.get_user("email", email_or_username.lower())

        if user:
            if checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
                log.info(f"User {user.ID} logged in")
                return {"info": {"username": user.username, "token": user.token()}}

            else:
                log.warning(f"Invalid credentials to user {user.ID}")
                return {"error": "Credenciales inválidas"}

        else:
            return {"error": "Credenciales inválidas"}
    
    def register(self, username: str, email: str, password: str) -> dict: 
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
        if not (self.__is_valid_username(username) or self.__is_valid_email(email) or self.__is_valid_password(password)):
            return {"error": "Credenciales inválidas"}
        
        if users.get_user("username", username) or users.get_user("email", email):
            return {"error": "Ya en uso"}

        user = users.create_user(username.capitalize(), email.lower(), password)

        if user:
            log.info(f"User {user.ID} created and logged in")
            return {"created": {"username": user.username, "token": user.token()}}

        else:
            log.error(f"Error creating the user {{username: {username}, email: {email}, password: {password}}}")
            return {"error": "Error al crear el usuario"}
    
    #Users

    def get_user(self, username: str, request_user: dict) -> dict:
        """
        Obtiene y filtra la información de un usuario en función de la solicitud.

        Args:
            username (str): Nombre de usuario a buscar.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            dict: Información filtrada del usuario o un diccionario vacío si no se encuentra.
        """
        request_User = User_lite(request_user) if request_user.get("ID", None) else None
        if request_User:
            user = users.get_user("username", username.capitalize())

            if user:
                log.info(f"User {user.ID} fetched by User {request_User.ID}")
                return {"info": user.filter(request_User)}

            return {"error": "No encontrado"}
        return {"error": "No autorizado"}
    
    #Follows

    def follownt(self, following_username: str, request_user: dict) -> dict:
        """
        Permite a un usuario seguir o dejar de seguir a otro.

        Args:
            following_username (str): Nombre del usuario a seguir o dejar de seguir.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            dict: Información filtrada del usuario seguido o un diccionario vacío si falla la operación.
        """
        follower = User_lite(request_user)
        following = users.get_user("username", following_username)
        
        if following:
            if follower.ID not in following.followers:
                if users.follow(following, follower):
                    log.info(f"User {following.ID} followed by {follower.ID}")
                    return {"info": users.get_user("ID", following.ID).filter(follower)}
                
                log.error(f"Following error by {follower.ID} to {following.ID}")
                return {"error": "Error al seguir al usuario"}

            else:
                if users.unfollow(following, follower):
                    log.info(f"User {following.ID} unfollowed by {follower.ID}")
                    return {"info": users.get_user("ID", following.ID).filter(follower)}
                
                log.error(f"Unollowing error by {follower.ID} to {following.ID}")
                return {"error": "Error al dejar de seguir al usuario"}
        return {"error" ,"No encontrado"}
        
    #Posts

    def get_posts(self, request_user: dict = {}) -> list:
        """
        Obtiene todos los posts.

        Args:
            request_user (dict | opcional): Usuario que realiza la solicitud.

        Returns:
            list: Lista de posts.
            request_user (dict): Usuario que realiza la solicitud.
        """
        request_User = User_lite(request_user) if request_user else None
        log.info(f"All posts fetched by {request_User.ID if request_User is not None else 'invited'}")
        return {"info": posts.get_posts()}

    def get_post(self, post_id: int, request_user: dict) -> dict:
        """
        Obtiene y filtra un post específico.

        Args:
            post_id(int): ID del post.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            dict: Información filtrada del post o un diccionario vacío si no se encuentra.
        """
        request_User = User_lite(request_user)
        if request_User.ID:
            post = posts.get_post("ID", post_id)
            
            if post:
                log.info(f"Post {post.ID} fetched by {request_User.ID}")
                return {"info": post.filter(request_User)}
        
        return {"error": "No encontrado"}
    
    def create_post(self, name: str, location: str, review: str, rating: int, imageUrl: str, creator: dict) -> int:
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
        
        if rating < 0 or rating > 10:
            return {"error": "Rating inválido"}

        if not self.is_valid_image_url(imageUrl):
            return {"error": "Imagen inválida"}

        request_User = User_lite(creator)
        post = posts.create_post(name.capitalize(), location.capitalize(), review.capitalize(), rating, imageUrl, request_User)
        
        if post:
            log.info(f"Post {post.ID} created")
            return {"info": post.ID}
        
        log.error(f"Error creating the post {post.json()}")
        return {"error": "Error al crear el post"}
    
    def edit_post(self, post_id: int, name: str, location: str, review: str, rating: int, imageUrl: str, request_user: dict) -> bool:
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
        request_User = User_lite(request_user)
        post = posts.get_post("ID", post_id)

        new_data = {}
        if name:
            new_data["name"] = name
        
        if location: 
            new_data["location"] = location

        if review: 
            new_data["review"] = review

        if rating and rating != 0: 
            rating = int(rating)
            if rating < 0 or rating > 10:
                return {"error": "Rating inválido"}
            new_data["rating"] = rating

        if imageUrl: 
            if not self.is_valid_image_url(imageUrl):
                return {"error": "Imagen inválida"}
            new_data["imageUrl"] = imageUrl

        if not new_data:
            return {"info": True}

        if post:
            if request_User != post.creator:
                return {"error": "No está autorizado"}
            
            edited = posts.edit_post(post, new_data)
            if edited != "same":
                log.info(f"Post {post.ID} edited {{original: {post.json()}, edit: {edited}}}")
                return {"info": True}
            else:
                return {"info": True}
        
        log.error(f"Error editing the post {post_id}, new_data: {new_data}")
        return {"error": "Error al editar el Post"}
    
    def delete_post(self, post_id: int, request_user: dict) -> bool:
        """
        Elimina un post.

        Args:
            post_id (int): ID del post a eliminar.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si el post se eliminó, False en caso contrario.
        """
        request_User = User_lite(request_user)
        post = posts.get_post("ID", post_id)
        if post:
            if request_User != post.creator:
                return {"error": "No está autorizado"}
            
            deleted = posts.delete_post(post)

            if deleted:
                log.info(f"Post {post.ID} deleted {{original: {post.json()}}}")
                return {"info": deleted}
        
        log.error(f"Error deleting post {{post.json()}}")
        return {"error": "Error al borrar el post"}
    
    #Comments

    def new_comment(self, post_id: int, content: str, rating:int, request_user: dict) -> bool:
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
        if rating < 0 or rating > 10:
            return {"error": "Rating inválido"}
        
        creator = User_lite(request_user)
        comment = comments.new_comment(post_id, content, rating, creator)
        if comment:
            log.info(f"Comment {comment.ID} created by {creator.ID} in {post_id}")
            return {"info": True}
        log.error(f"Error al crear el comentario {{content: {content}, rating: {rating}}} en el post {post_id} por el usuario {creator.ID}")
        return {"error": "Error al crear el comentario"}
    
    def delete_comment(self, post_id: int, comment_id: int, request_user: dict) -> bool:
        """
        Elimina un comentario de un post.

        Args:
            post_id (int): ID del post.
            comment_id (int): ID del comentario a eliminar.
            request_user (dict): Usuario que realiza la solicitud.

        Returns:
            bool: True si el comentario se eliminó, False en caso contrario.
        """
        request_User = User_lite(request_user)
        comment = comments.get_comment(post_id, comment_id)
        if comment:
            if request_User != comment.creator:
                return {"error": "No está autorizado"}
            deleted = comments.delete_comment(post_id, comment)

            if deleted:
                log.info(f"Comentario eliminado {{original: {comment.json()}}}")
                return {"info": deleted}
            log.info(f"Error al eliminar el comentario {comment.py}")
            return {"error": "Error al borrar el comentario"}   

        return {"error": "No encontrado"}
    #Token

    def verify_token(self, request_token: str) -> bool:
        """
        Verifica la validez de un token.

        Args:
            request_token (str): Token a verificar.

        Returns:
            bool: True si el token es válido, False de lo contrario.
        """
        return jwtoken.is_valid(request_token)
 
app = App()