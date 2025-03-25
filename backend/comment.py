from datetime import datetime, timezone
from user import User_lite

class Comment:
    """
    Representa un comentario en el sistema.

    Attributes:
        ID (int): Identificador único del comentario.
        content (str): Contenido del comentario.
        creator (User_lite): Usuario que creó el comentario.
        rating (int): Calificación del comentario.
        createdAt (str): Fecha de creación en formato ISO 8601.
    """
    def __init__(self, data: dict = {}):
        """
        Inicializa un comentario con los datos proporcionados.

        Args:
            data (dict): Diccionario con los datos del comentario.
                - ID (int): Identificador único.
                - content (str): Contenido del comentario.
                - creator (User_lite): Objeto del usuario creador.
                - rating (int): Calificación del comentario.
                - createdAt (str): Fecha de creación.
        """
        self.ID = data.get("ID", None)
        self.content = data.get("content", None)
        self.creator = User_lite(data.get("creator", None))
        self.rating = data.get("rating", 0)
        self.createdAt = data.get("createdAt", datetime.now(timezone.utc).isoformat(timespec="milliseconds"))

    def json(self) -> dict:
        """
        Convierte el comentario en un diccionario JSON.

        Returns:
            dict: Representación JSON del comentario.
        """
        return {
            "ID": self.ID if self.ID else None,
            "content": self.content if self.content else None,
            "creator": self.creator.json() if self.creator else None,
            "rating": int(self.rating) if self.rating else None,
            "createdAt": self.createdAt if self.createdAt else None
        }

    def filter(self, request_user: User_lite = User_lite()) -> dict:
        """
        Filtra la información del comentario que debe ser devuelta, dependiendo del usuario que hace la solicitud.

        Args:
            request_user (User_lite): El usuario que hace la solicitud.

        Returns:
            dict: Diccionario con la información filtrada del comentario, incluyendo el nombre del creador
                y un campo para indicar si el comentario es editable por el usuario solicitante.
        """
        returned_comment = self.json()
        returned_comment["creator"] = self.creator.username if self.creator else None
        returned_comment["editable"] = True if request_user == self.creator else False
        return returned_comment