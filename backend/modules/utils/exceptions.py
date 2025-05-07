from bson import ObjectId
from modules.utils.log import Log
from typing import List, Optional

class CustomException(Exception):
    """Base class for custom exceptions with auto-logging"""
    
    def __init__(self, data: str = "Error", error: Optional[str] = None, log: Optional[str] = None, code: int = 500) -> None:
        """
        Initialize a custom exception.

        Args:
            data (str, optional): The data to error. Defaults to "Error".
            error (Optional[str], optional): The error given. Defaults to None.
            log (Optional[str], optional): The log info. Defaults to None.
            code (int, optional): The error code. Defaults to 500.
        """        
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
    """Custom exception for an exception."""
    default_error: str = "Error desconocido"

    def __init__(self, data: str = "Error", error: Optional[Exception] = None, log: Optional[str] = None, code: int = 500) -> None:     
        """
        An general error.

        Args:
            data (str, optional): The data to the error. Defaults to "Error".
            error (Optional[Exception], optional): The error given. Defaults to None.
            log (Optional[str], optional): The log info. Defaults to None.
            code (int, optional): The error code. Defaults to 500.
        """        
        super().__init__(
            data=data, 
            error=str(error) or self.default_error, 
            log=log, 
            code=getattr(error, "code", code)
        )


class NotFound(CustomException):
    """Custom exception for not found."""
    default_data: str = "Not Found"
    default_error: str = "Object"

    def __init__(self, error: Optional[str] = None) -> None:
        """
        Initialize a Not Found exceotion

        Args:
            error (Optional[str], optional): Object that not found. Defaults to None.
        """
        #data = f"{error} {self.default_data}" if error else self.default_data
        super().__init__(
            #data=f"{error or self.default_error} {self.default_data}", 
            #data=data,
            data=self.default_data,
            code=404
        )


class Unauthorized(CustomException):
    """Custom exception for unauthorized."""
    default_data: str = "Unauthorized"
    default_error: str = "Unauthorized"

    def __init__(self, error: Optional[str] = None) -> None:
        """
        Initialize an unauthorized exception.

        Args:
            error (Optional[str], optional): Error. Defaults to None.
        """        
        super().__init__(
            data=self.default_data, 
            error=error or self.default_error, 
            code=401
        )


class AlreadyInUse(CustomException):
    """Custom exception for already in use."""
    default_data: str = "Already in use"
    default_error: str = "Username or email"

    def __init__(self, error: Optional[str] = None) -> None:
        """
        Initialize an already in use exception.

        Args:
            error (Optional[str], optional): Error. Defaults to None.
        """         
        super().__init__(
            data=self.default_data,
            error=error or self.default_error, 
            code=409
        )


class IncorrectCredential(CustomException):
    """Custom exception for incorrect credential."""

    def __init__(self, user_id: Optional[ObjectId] = None) -> None:
        """
        Initialize an incorrect credential exception.

        Args:
            error (Optional[str], optional): Error. Defaults to None.
        """ 
        super().__init__(
            data="Incorrect credentials",
            log=f"Invalid credentials to User: {user_id}",
            code=400
        )


class InvalidCredential(CustomException):
    """Custom exception for invalid credentaial."""
    default_data: str = "Invalid credentials"
    default_error: str = "Username, email or password"

    def __init__(self, error: Optional[str] = None) -> None:
        """
        Initialize an invalid credentaial exception.

        Args:
            error (Optional[str], optional): Error. Defaults to None.
        """ 
        super().__init__(
            data=self.default_data,
            error=error or self.default_error,
            code=400
        )