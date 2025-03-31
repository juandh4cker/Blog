from bson import ObjectId
from modules.database import DB as db
from typing import Any, Dict, List, Optional
from modules.utils.generals import creation_date, encode_password
from modules.utils.token import Token

class User_lite:
    """
    Representa a un usuario en el sistema de forma más eficiente.

    Attributes:
        ID (str): Identificador único del usuario.
        username (str): Nombre de usuario.
    """
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Inicializa un usuario con los datos proporcionados.

        Args:
            data (dict): Diccionario con los datos del usuario.
                - ID (str): Identificador único del usuario.
                - username (str): Nombre de usuario.
        """
        try:
            self.valid: bool = True
            if not data or any(field is None for field in [data.get("ID"), data.get("username")]):
                self.valid = False

            else:
                self.ID: int = int(data["ID"])
                self.username: str = str(data["username"])
            
        except Exception as e:
            raise ValueError(f"Error al inicializar User_lite: {e}.")

    def __bool__(self) -> bool:
        """Devuelve si la instancia es válida.
        
        Returns:
            valid (bool): Validez de la instancia.
        """
        return self.valid

    def __eq__(self, other: object) -> bool:
        """
        Verifica si un usuario es igual a otro.

        Args:
            other (User_lite): Usuario a igualar.

        Returns:
            bool: True si es igual, False si no
        """
        if not isinstance(other, (User, User_lite)):
            return NotImplemented
        return self.ID == other.ID
    
    def json(self) -> dict:
        """
        Convierte el usuario en un diccionario JSON.

        Returns:
            Dict[str, Any]: Representación JSON del user o {} si falta algún valor.
        """
        if any(field is None for field in [self.ID, self.username]):
            raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
        
        try:
            return {
                "ID": self.ID,
                "username": self.username
            }
        
        except Exception as e:
            raise ValueError(f"Error al parsear el User: {e}")
        
    def token(self) -> str:
        """
        Genera un token para el usuario.

        Returns:
            str | None: Token codificado del usuario o None si ocurre un error.
        """
        if not self.valid:
            raise ValueError("Error al crear el token: El usuario no es válido.")

        try:
            return Token.encode(self.ID, self.username)

        except Exception as e:
            raise RuntimeError(f"Error al crear el token: {e}") from e


class User(User_lite):
    """
    Representa a un usuario en el sistema.

    Attributes:
        _id (ObjectId): Identificador único del usuario en la base de datos.
        ID (str): Identificador único del usuario.
        username (str): Nombre de usuario.
        email (str): Correo electrónico del usuario.
        password (str): Contraseña del usuario.
        posts (list): Lista de posts creados por el usuario.
        followers (list): Lista de seguidores del usuario.
        following (list): Lista de usuarios que el usuario está siguiendo.
        createdAt (str): Fecha de creación en formato ISO 8601.
    """
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Inicializa un usuario con los datos proporcionados.

        Args:
            data (dict): Diccionario con los datos del usuario.
                - _id (ObjectId): Identificador único del usuario en la base de datos.
                - ID (str): Identificador único del usuario.
                - username (str): Nombre de usuario.
                - email (str): Correo electrónico del usuario.
                - password (str): Contraseña del usuario.
                - posts (list, opcional): Lista de posts creados por el usuario.
                - followers (list, opcional): Lista de seguidores del usuario.
                - following (list, opcional): Lista de usuarios que el usuario está siguiendo.
                - createdAt (str, opcional): Fecha de creación del usuario.
        """
        try:
            self.valid: bool = True
            if not data:
                self.valid = False

            else:            
                self._id: ObjectId = ObjectId(data.get("_id"))
                self.ID: int = int(data["ID"])
                self.username: str = str(data["username"])
                self.email: str = str(data["email"])
                self.password: str = str(data["password"])
                self.posts: List[int] = data.get("posts", [])
                self.followers: List[int] = data.get("followers", [])
                self.following: List[int] = data.get("following", [])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error al inicializar User_lite: {e}.")

    def json(self) -> Dict[str, Any]:
        """
        Convierte el usuario en un diccionario JSON.

        Returns:
            Dict[str, Any]: Representación JSON del user o {} si falta algún valor.
        """
        try:
            if any(field is None for field in [self.ID, self.username]):
                raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
            
            return {
                "_id": str(self._id),
                "ID": self.ID,
                "username": self.username,
                "email": self.email,
                "password": self.password,
                "posts": self.posts,
                "followers": self.followers,
                "following": self.following,
                "createdAt": self.createdAt
            }
        
        except Exception as e:
            raise ValueError(f"Error al parsear el User: {e}")

    def filter(self, request_user: User_lite) -> Dict[str, Any]:
        """
        Filtra la información del usuario que debe ser devuelta, dependiendo del usuario que hace la solicitud.
        
        Args:
            request_user (User_lite): Usuario que hace la petición.

        Returns:
            dict: Diccionario con la información filtrada del usuario.
        """
        from modules.posts import Posts
        try:
            if any(field is None for field in [self.ID, self.username, self.posts]):
                raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
            
            returned_user: Dict[str, Any] = {
                "username": self.username,
                "posts": Posts.get_user_posts(self.posts),
                "followers": len(self.followers),
            }
            
            following: bool | None = None if request_user == self else request_user.ID in self.followers

            if following is not None:
                returned_user["isFollowing"] = following

            return returned_user

        except Exception as e:
            raise ValueError(f"Error al filtrar el usuario: {e}")

    def lite(self) -> User_lite:
        """
        Convierte el usuario en un formato adecuado.

        Returns:
            dict: Representación del usuario con "ID" y "username".
        """
        try:
            if any(field is None for field in [self.ID, self.username]):
                raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
            
            return User_lite({
                "ID": self.ID,
                "username": self.username
            })
        
        except Exception as e:
            raise ValueError(f"Error al litear el usuario: {e}")


class Users:
    """
    Maneja la gestión de usuarios en el sistema.
    """
    @classmethod
    def get_user(self, field: str = "ID", value: int | str = "") -> User:
        """
        Obtiene un usuario en específico.

        Args:
            field (str): Campo del usuario del cual se desea buscar.
            value (int | str): Valor del campo que dará una coincidencia.

        Returns:
            User: Usuario encontrado o None si no se encuentra.
        """
        try:      
            user: Dict[str, Any] = db.get_user(field, value)
            return User(user)

        except Exception as e:
            raise ValueError(f"Error al obtener el usuario: {e}") from e
        
    @classmethod
    def create_user(self, username: str, email: str, password: str) -> User:
        """
        Crea un usuario.

        Args:
            username (str): Nombre del usuario.
            email (str): Email del usuario.
            password (str): Contraseña del usuario.

        Returns:
            User: User si se crea, None si no.
        """
        try:
            ID: int = db.count_users() + 2
            new_user: User = User({
                "ID": ID,
                "username": username,
                "email": email,
                "password": encode_password(password)
            })
            return new_user if db.add_user(new_user.json()) else User()
        
        except Exception as e:
            raise ValueError(f"Error al crear el usuario: {e}") from e
        
    @classmethod
    def follow(self, follower: User_lite, following: User_lite) -> bool:
        """
        Sigue a un usuario.

        Args:
            follower (User_lite): Usuario que vá a seguir.
            following (User_lite): Usuario al que van a seguir.

        Returns:
            bool: True si lo siguió, False si no.
        """
        try:
            return db.follow(follower.ID, following.ID)
        
        except Exception as e:
            raise ValueError(f"Error al seguir (o no) el usuario: {e}") from e
        
    @classmethod
    def unfollow(self, follower: User_lite, following: User_lite) -> bool:
        """
        Deja de seguir a un usuario.

        Args:
            follower (User_lite): Usuario que vá a dejar de seguir.
            following (User_lite): Usuario al que van a dejar de seguir.

        Returns:
            bool: True si lo dejó de seguir, False si no.
        """
        try:
            return db.unfollow(follower.ID, following.ID)
        
        except Exception as e:
            raise ValueError(f"Error al eliminar el usuario: {e}") from e