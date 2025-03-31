from modules.utils.log import Log 

class CustomException(Exception):
    """Clase base para excepciones personalizadas con log automático."""
    def __init__(self, data: str = "Error", error: str = "", log: str = "", code: int = 0):
        self.message: str = f"Message: {data} | Error: {error}" if error else f"Message: {data}"
        self.code: int = code
        super().__init__(self.message)  
        Log.error(self.message if not log else f"{self.message} | Log: {log}")

#General 
class GeneralError(CustomException):
    """Excepción personalizada para error general."""
    default_error = "Error desconocido"
    def __init__(self, data: str = "Error", error: str = default_error, log: str = "", code=500):
        super().__init__(data=data, error=str(error), log=log)

class NotFound(CustomException):
    """Excepción personalizada para no encontrado."""
    default_error = "Object"
    def __init__(self, error: str = default_error):
        data = "Not Found"
        super().__init__(data=data, error=error, code=404) 
   
class Unauthorized(CustomException):
    """Excepción personalizada para no autorizado."""
    default_error = ""
    def __init__(self, error: str = default_error):
        data = "Unauthorized"
        super().__init__(data=data, error=error, code=401)

#Access
class AlreadyInUse(CustomException):
    """Excepción personalizada para ya en uso."""
    default_error = "Username or email"
    def __init__(self, error: str = default_error):
        data = "Already in use"
        super().__init__(data=data, error=error, code=409)

class IncorrectCredential(CustomException):
    """Excepción personalizada para credenciales incorrectas."""
    def __init__(self, user_id: int = 0):
        data = "Incorrect credentials "
        super().__init__(data=data, log=f"Invalid credentials to User: {user_id}", code=400)

class InvalidCredential(CustomException):
    """Excepción personalizada para credenciales inválidas."""
    default_error = "Username, email or password"
    def __init__(self, error: str = default_error):
        data = "Invalid credentials"
        super().__init__(data=data, error=error, code=400)