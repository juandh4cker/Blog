from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv 
from os import getenv
from typing import Any, Dict
from modules.utils.log import Log
import jwt

load_dotenv()

class Token:
    """
    Representa un token en el sistema.

    Attributes:
        __JWT_SECRET_KEY (str): Clave secreta del token.
        __JWT_ALGORITHM (str): Algoritmo de encriptación del token.
        __JWT_EXPIRATION (int): Duración del token en días.
    """
    __JWT_SECRET_KEY: str = getenv("JWT_SECRET_KEY") or ""
    __JWT_ALGORITHM: str = getenv("JWT_ALGORITHM", "HS256")
    __JWT_EXPIRATION: int = int(getenv("JWT_EXPIRATION", 1))

    if not __JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY no está configurado en el entorno.")

    @classmethod
    def __decode(cls, token: str) -> Dict[str, Any]:
        """
        Decodifica un token JWT y maneja excepciones internas.
        
        Args:
            token (str): Token JWT a decodificar.

        Returns:
            Dict[str, Any]: Datos del token.
        """
        try:
            return jwt.decode(token, cls.__JWT_SECRET_KEY, algorithms=[cls.__JWT_ALGORITHM])
        
        except jwt.ExpiredSignatureError:
            #Log.error("Token expirado.")
            pass

        except jwt.InvalidTokenError:
            Log.error(f"Token inválido: {token}.")
            pass

        except Exception as e:
            raise RuntimeError(f"Error al codificar el token: {e}") from e

        return {}

    @classmethod
    def encode(cls, user_id: int, username: str) -> str:
        """
        Genera un token JWT con un tiempo de expiración dado.
        
        Args:
            user_id (int): ID del usuario.
            username (str): Nombre de usuario.
        
        Returns:
            str: Token JWT.
        """
        try:
            payload: Dict[str, Any] = {
                "ID": int(user_id),
                "username": str(username),
                "exp": datetime.now(timezone.utc) + timedelta(days=cls.__JWT_EXPIRATION)
            }
            return jwt.encode(payload, cls.__JWT_SECRET_KEY, algorithm=cls.__JWT_ALGORITHM)
        
        except Exception as e:
            raise RuntimeError(f"Error al codificar el token: {e}") from e

    @classmethod
    def is_valid(cls, token: str) -> Dict[str, Any]:
        """
        Verifica si un token JWT es válido.
        
        Args:
            token (str): Token JWT a verificar.

        Returns:
            Dict[str, Any]: {'verify': bool, 'user': dict} si es válido, 
                            {'verify': False, 'error': str} si no lo es.
        """
        try:
            if not token:
                return {"verify": False, "error": "Token requerido"}

            decoded_token: Dict[str, Any] = cls.__decode(token)
            if decoded_token:
                user_data: Dict[str, Any] = {k: v for k, v in decoded_token.items() if k != "exp"}
                return {"verify": True, "user": user_data}

            return {"verify": False, "error": "Token inválido"}

        except Exception as e:
            raise RuntimeError(f"Error al validar el token: {e}") from e