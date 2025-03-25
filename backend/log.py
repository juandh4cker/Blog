from dotenv import load_dotenv
from os import path, getenv
import logging

class Log:
    """
    Clase para manejar registros de eventos (logs) en la aplicación.
    
    Attributes:
        log_file (str): Ruta del archivo de registro.
    """
    def __init__(self):
        """
        Inicializa el sistema de registro configurando el archivo de logs y el formato de los mensajes.
        """
        load_dotenv()
        filename = getenv("LOG_FILENAME", "api.log")
        self.__log_file = path.join(path.dirname(path.abspath(__file__)), filename)
        logging.basicConfig(
            filename=self.__log_file,
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            encoding="utf-8"
        )
    
    @staticmethod
    def info(message: str, **kwargs):
        """
        Registra un mensaje de nivel INFO en el archivo de logs.

        Args:
            message (str): Mensaje a registrar.
            **kwargs: Parámetros opcionales que se pasan a logging.info.
        """
        logging.info(message, **kwargs)
    
    @staticmethod
    def error(message: str, **kwargs):
        """
        Registra un mensaje de nivel ERROR en el archivo de logs.

        Args:
            message (str): Mensaje a registrar.
            **kwargs: Parámetros opcionales que se pasan a logging.error.
        """
        logging.error(message, **kwargs)
    
    @staticmethod
    def warning(message: str, **kwargs):
        """
        Registra un mensaje de nivel WARNING en el archivo de logs.

        Args:
            message (str): Mensaje a registrar.
            **kwargs: Parámetros opcionales que se pasan a logging.warning.
        """
        logging.warning(message, **kwargs)
    
log = Log()