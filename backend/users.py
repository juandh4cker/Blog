from bcrypt import hashpw, gensalt
from database import database
from user import User, User_lite

class Users:
    """
    Maneja la gestión de usuarios en el sistema.
    
    Attributes:
        db (Databasae): Instancia de la base de datos.
    """
    def __init__(self):
        """
        Inicializa la clase Users con una instancia de la base de datos.
        """
        self.__db = database

    def get_user(self, field: str = "ID", value: int | str = None) -> User | None:
        """
        Obtiene un usuario en específico.

        Args:
            field (str): Campo del usuario del cual se desea buscar.
            value (int | str): Valor del campo que dará una coincidencia.

        Returns:
            User: Usuario encontrado o None si no se encuentra.
        """
        user = self.__db.get_user(field, value)
        return User(user) if user else None
        
    def create_user(self, username: str, email: str, password: str) -> User | None:
        """
        Crea un usuario.

        Args:
            username (str): Nombre del usuario.
            email (str): Email del usuario.
            password (str): Contraseña del usuario.

        Returns:
            User | None: User si se crea, None si no.
        """
        def encode_password(password: str) -> str:
            """
            Codifica una contraseña con bcrypt.

            Args:
                password (str): Contraseña la cual se desea codificar.

            Returns:
                str: Contraseña codificada.
            """
            return hashpw(password.encode("utf-8"), gensalt(10)).decode("utf-8")
        
        ID = self.__db.count_users() + 2
        data = {
            "ID": ID,
            "username": username,
            "email": email,
            "password": encode_password(password)
        }
        new_user = User(data)

        return new_user if self.__db.add_user(new_user.json()) else None
        
    def follow(self, follower: User_lite, following: User_lite) -> bool:
        """
        Sigue a un usuario.

        Args:
            follower (User_lite): Usuario que vá a seguir.
            following (User_lite): Usuario al que van a seguir.

        Returns:
            bool: True si lo siguió, False si no.
        """
        return self.__db.follow(follower.ID, following.ID)
        
    def unfollow(self, follower: User_lite, following: User_lite) -> bool:
        """
        Deja de seguir a un usuario.

        Args:
            follower (User_lite): Usuario que vá a dejar de seguir.
            following (User_lite): Usuario al que van a dejar de seguir.

        Returns:
            bool: True si lo dejó de seguir, False si no.
        """
        return self.__db.unfollow(follower.ID, following.ID)

users = Users()