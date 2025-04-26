from dotenv import load_dotenv 
from os import getenv, path
from typing import Any
import logging

load_dotenv()

class Log:
    __LOG_FILE_PATH: str = path.join(path.dirname(path.dirname(path.dirname(path.abspath(__file__)))), getenv("LOG_FILENAME", "api.log"))
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        encoding="utf-8",
        handlers=[
            logging.FileHandler(__LOG_FILE_PATH, encoding="utf-8"),
            logging.StreamHandler()
        ]
    )

    logger: logging.Logger = logging.getLogger("API_Logger")

    @classmethod
    def info(cls, message: str, **kwargs: Any) -> None:
        cls.logger.info(message, **kwargs)

    @classmethod
    def error(cls, message: str, **kwargs: Any) -> None:
        cls.logger.error(message, **kwargs)

    @classmethod
    def warning(cls, message: str, **kwargs: Any) -> None:
        cls.logger.warning(message, **kwargs)