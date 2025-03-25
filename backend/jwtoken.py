from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from os import getenv
import jwt

class Token:
    """
    Representa un token en el sistema.

    Attributes:
        __JWT_SECRET_KEY (str): Clave secreta del token.
        __JWT_ALGORITHM (str): Algoritmo de encriptación del token.
    """
    def __init__(self):
        """
        Inicializa el generador de tokens JWT.
        """
        load_dotenv()
        self.__JWT_SECRET_KEY = getenv("JWT_SECRET_KEY", "default_secret_key")
        self.__JWT_ALGORITHM = getenv("JWT_ALGORITHM", "HS256")

    def __decode(self, token: str) -> dict:
        """
        Decodifica un token JWT y maneja excepciones internas.
        
        Attributes:
            token (str): Token JWT a decodificar.

        Returns:
            dict: Datos del token.
        """
        try:
            return jwt.decode(token, self.__JWT_SECRET_KEY, algorithms=[self.__JWT_ALGORITHM])

        except:
            return {} #Mejorar excepciones, por expiración o inválidez (poner en logs).

    def encode(self, user_id: int, username: str, days: int = 1) -> str: #Archivo para la duración de los días
        """
        Genera un token JWT con un tiempo de expiración dado.
        
        Attributes:
            user_id (int): ID del usuario.
            username (str): Nombre de usuario.
            days (int): Días de validez del token (default: 1).
        
        Returns:
            str: Token JWT.
        """
        try:
            payload = {
                "ID": user_id,
                "username": username,
                "exp": datetime.now(timezone.utc) + timedelta(days=days)
            }
            return jwt.encode(payload, self.__JWT_SECRET_KEY, algorithm=self.__JWT_ALGORITHM)
        
        except:
            ""

    def is_valid(self, token: str) -> dict:
        """
        Verifica si un token JWT es válido.
        
        Attributes:
            token (str): Token JWT a verificar.

        Returns:
            dict: La verificación y los datos del usuario si es válido.
        """
        if not token:
            return {"verify": False, "error": "Token requerido"}

        decoded_token = self.__decode(token)

        if decoded_token:
            del decoded_token["exp"]
            return {"verify": True, "user": decoded_token}
        
        return {"verify": False, "error": "Token inválido"}

jwtoken = Token()