from bson import ObjectId
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv 
from os import getenv
from typing import Any, Dict
from modules.utils.log import Log
import jwt

load_dotenv()

class Token:
    """
    Controls the JWT in the app.

    Args:
    __JWT_SECRET_KEY (str): The key to hash the JWT.        
    __JWT_ALGORITHM (str): The JWT algorithm. Defaults to "HS256".
    __JWT_EXPIRATION (int): The valid time of the token.

    """
    __JWT_SECRET_KEY: str = getenv("JWT_SECRET_KEY") or ""
    __JWT_ALGORITHM: str = getenv("JWT_ALGORITHM", "HS256")
    __JWT_EXPIRATION: int = int(getenv("JWT_EXPIRATION", 1))

    if not __JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY isn't configured in the env.")

    @classmethod
    def __decode(cls, token: str) -> Dict[str, Any]:
        """
        Decode a JWT.

        Args:
            token (str): The JWT token to decode.

        Raises:
            RuntimeError: Error decoding the token.

        Returns:
            Dict[str, Any]: Token info or {}.
        """        
        try:
            return jwt.decode(token, cls.__JWT_SECRET_KEY, algorithms=[cls.__JWT_ALGORITHM])
        
        except jwt.ExpiredSignatureError:
            pass

        except jwt.InvalidTokenError:
            Log.error(f"Invalid Token: {token}.")
            pass

        except Exception as e:
            raise RuntimeError(f"Error decodifing the token: {e}") from e

        return {}

    @classmethod
    def encode(cls, user_id: ObjectId, username: str) -> str:
        """
        Encode a token.

        Args:
            user_id (ObjectId): The user's ID.
            username (str): The user's username.

        Raises:
            RuntimeError: If it can't be encoded.

        Returns:
            str: The JWT token.
        """        
        try:
            payload: Dict[str, Any] = {
                "_id": str(user_id),
                "username": str(username),
                "exp": datetime.now(timezone.utc) + timedelta(days=cls.__JWT_EXPIRATION)
            }
            return jwt.encode(payload, cls.__JWT_SECRET_KEY, algorithm=cls.__JWT_ALGORITHM)
        
        except Exception as e:
            raise RuntimeError(f"Error codifing the token: {e}") from e

    @classmethod
    def is_valid(cls, token: str) -> Dict[str, Any]:
        """
        Verify a JWT.

        Args:
            token (str): The token to verify.

        Raises:
            RuntimeError: If the token can't be validate.

        Returns:
            Dict[str, Any]: {"verify": True, "user": (token info)} or {"verify": False, "error": (error)}
        """        
        try:
            if not token:
                return {"verify": False, "error": "Required token"}

            decoded_token: Dict[str, Any] = cls.__decode(token)
            if decoded_token:
                user_data: Dict[str, Any] = {k: v for k, v in decoded_token.items() if k != "exp"}
                return {"verify": True, "user": user_data}

            #agregar token caduco
            return {"verify": False, "error": "Invalid token"}

        except Exception as e:
            raise RuntimeError(f"Error validating the token: {e}") from e