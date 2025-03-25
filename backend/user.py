from bson import ObjectId
from datetime import datetime, timezone
from jwtoken import jwtoken

class User:
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
    def __init__(self, data: dict = {}):
        """
        Inicializa un usuario con los datos proporcionados.

        Args:
            data (dict): Diccionario con los datos del usuario.
                - _id (ObjectId, opcional): Identificador único del usuario en la base de datos.
                - ID (str): Identificador único del usuario.
                - username (str): Nombre de usuario.
                - email (str): Correo electrónico del usuario.
                - password (str): Contraseña del usuario.
                - posts (list, opcional): Lista de posts creados por el usuario.
                - followers (list, opcional): Lista de seguidores del usuario.
                - following (list, opcional): Lista de usuarios que el usuario está siguiendo.
                - createdAt (str, opcional): Fecha de creación del usuario.
        """
        self._id = ObjectId(data.get("_id", None)) if data.get("_id") else None
        self.ID = data.get("ID", None)
        self.username = data.get("username", None)
        self.email = data.get("email", None)
        self.password = data.get("password", None)
        self.posts = data.get("posts", []) if data.get("posts") is not None else []
        self.followers = data.get("followers", []) if data.get("followers") is not None else []
        self.following = data.get("following", []) if data.get("following") is not None else []
        self.createdAt = data.get("createdAt", datetime.now(timezone.utc).isoformat(timespec="milliseconds") + "Z")
    
    def __eq__(self, otro: "User | User_lite") -> bool:
        """
        Verifica si un usuario es igual a otro.

        Args:
            otro (User | User_lite): Usuario a igualar.

        Returns:
            bool: True si es igual, False si no
        """
        return self.ID == otro.ID if isinstance(otro, User) or isinstance(otro, User_lite) else False

    def json(self) -> dict:
        """
        Convierte el usuario en un diccionario JSON.

        Returns:
            dict: Representación JSON del usuario.
        """
        return {
            "ID": self.ID if self.ID else None,
            "username": self.username if self.username else None,
            "email": self.email if self.email else None,
            "password": self.password if self.password else None,
            "posts": self.posts if self.posts else [],
            "followers": self.followers if self.followers else [],
            "following": self.following if self.following else [],
            "createdAt": self.createdAt if self.createdAt else None
        }

    def filter(self, request_user: "User_lite") -> dict:
        """
        Filtra la información del usuario que debe ser devuelta, dependiendo del usuario que hace la solicitud.
        
        Args:
            request_user (User_lite): Usuario que hace la petición.

        Returns:
            dict: Diccionario con la información filtrada del usuario.
        """
        return {
            "username": self.username,
            "posts": self.posts,
            "followers": len(self.followers),
            "isFollowing": "yourself" if request_user == self else request_user.ID in self.followers
        }

    def lite(self) -> dict:
        """
        Convierte el usuario en un formato adecuado.

        Returns:
            dict: Representación del usuario con "ID" y "username".
        """
        return User_lite({
            "ID": self.ID,
            "username": self.username
        })

    def token(self) -> str:
        """
        Genera un token para el usuario.

        Returns:
            str | None: Token codificado del usuario o None si ocurre un error.
        """
        return jwtoken.encode(self.ID, self.username)

class User_lite:
    """
    Representa a un usuario en el sistema de forma más eficiente.

    Attributes:
        ID (str): Identificador único del usuario.
        username (str): Nombre de usuario.
    """
    def __init__(self, data: dict = {}):
        """
        Inicializa un usuario con los datos proporcionados.

        Args:
            data (dict): Diccionario con los datos del usuario.
                - ID (str): Identificador único del usuario.
                - username (str): Nombre de usuario.
        """
        self.ID = data.get("ID", None)
        self.username = data.get("username", None)

    def __eq__(self, otro: "User | User_lite") -> bool:
        """
        Verifica si un usuario es igual a otro.

        Args:
            otro (User_lite): Usuario a igualar.

        Returns:
            bool: True si es igual, False si no
        """
        return self.ID == otro.ID if isinstance(otro, User) or isinstance(otro, User_lite) else False

    def json(self) -> dict:
        """
        Convierte el usuario en un diccionario JSON.

        Returns:
            dict: Representación del usuario con "ID" y "username".
        """

        return {
            "ID": self.ID,
            "username": self.username
        }

    def token(self) -> str:
        """
        Genera un token para el usuario.

        Returns:
            str | None: Token codificado del usuario o None si ocurre un error.
        """
        return jwtoken.encode(self.ID, self.username)