from bson import ObjectId
from modules.utils.log import Log
from typing import List, Optional

class CustomException(Exception):
    """Clase base para excepciones personalizadas con log automático."""
    
    def __init__(self, data: str = "Error", error: Optional[str] = None, log: Optional[str] = None, code: int = 0) -> None:
        parts: List[str] = [data.capitalize()]
        if error:
            self.error = error
            parts.append(f"Error: {error}")
        self.message: str = " | ".join(parts)
        self.code: int = code
        super().__init__(self.message)
        
        log_message = self.message if not log else f"{self.message} | Log: {log}"
        Log.error(log_message)


# Subclases

class GeneralError(CustomException):
    """Excepción personalizada para error general."""
    default_error: str = "Error desconocido"

    def __init__(self, data: str = "Error", error: Optional[Exception] = None, log: Optional[str] = None, code: int = 500) -> None:
        super().__init__(
            data=data, 
            error=str(error) or self.default_error, 
            log=log, 
            code=getattr(error, "code", code)
        )


class NotFound(CustomException):
    """Excepción personalizada para no encontrado."""
    default_data: str = "Not Found"
    default_error: str = "Object"

    def __init__(self, error: Optional[str] = None) -> None:
        super().__init__(
            data=f"{error or self.default_error} {self.default_data}", 
            code=404
        )


class Unauthorized(CustomException):
    """Excepción personalizada para no autorizado."""
    default_data: str = "Unauthorized"
    default_error: str = "Unauthorized"

    def __init__(self, error: Optional[str] = None) -> None:
        super().__init__(
            data=self.default_data, 
            error=error or self.default_error, 
            code=401
        )


class AlreadyInUse(CustomException):
    """Excepción personalizada para ya en uso."""
    default_data: str = "Already in use"
    default_error: str = "Username or email"

    def __init__(self, error: Optional[str] = None) -> None:
        super().__init__(
            data=self.default_data,
            error=error or self.default_error, 
            code=409
        )


class IncorrectCredential(CustomException):
    """Excepción personalizada para credenciales incorrectas."""

    def __init__(self, user_id: Optional[ObjectId] = None) -> None:
        super().__init__(
            data="Incorrect credentials",
            log=f"Invalid credentials to User: {user_id}",
            code=400
        )


class InvalidCredential(CustomException):
    """Excepción personalizada para credenciales inválidas."""
    default_data: str = "Invalid credentials"
    default_error: str = "Username, email or password"

    def __init__(self, error: Optional[str] = None) -> None:
        super().__init__(
            data=self.default_data,
            error=error or self.default_error,
            code=400
        )