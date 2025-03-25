from bson import ObjectId
from datetime import datetime, timezone
from comment import Comment
from user import User_lite

class Post:
    """
    Representa un post en el sistema.

    Attributes:
        _id (ObjectId): Identificador único del post en la base de datos.
        ID (str): Identificador único del post.
        name (str): Nombre del post.
        location (str): Ubicación asociada al post.
        review (str): Reseña o descripción del post.
        rating (float): Calificación del post.
        imageUrl (str): URL de la imagen asociada al post.
        creator (User_lite): Usuario que creó el post.
        comments (list): Lista de comentarios asociados al post.
        createdAt (str): Fecha de creación en formato ISO 8601.
    """
    def __init__(self, data: dict = {}):
        """
        Inicializa un post con los datos proporcionados.

        Args:
            data (dict): Diccionario con los datos del post.
                - _id (ObjectId, opcional): Identificador único del post en la base de datos.
                - ID (str): Identificador único del post.
                - name (str): Nombre del post.
                - location (str): Ubicación asociada al post.
                - review (str): Reseña o descripción del post.
                - rating (float): Calificación del post.
                - imageUrl (str): URL de la imagen asociada al post.
                - creator (User_lite): Objeto del usuario creador.
                - comments (list, opcional): Lista de comentarios asociados al post.
                - createdAt (str, opcional): Fecha de creación del post.
        """
        self._id = ObjectId(data.get("_id", None)) if data.get("_id") else None
        self.ID = data.get("ID", None)
        self.name = data.get("name", "")
        self.location = data.get("location", "")
        self.review = data.get("review", "")
        self.rating = data.get("rating", 0)
        self.imageUrl = data.get("imageUrl", "")
        self.creator = User_lite(data.get("creator", None))
        self.comments = data.get("comments", []) if data.get("comments") is not None else []
        self.createdAt = data.get("createdAt", datetime.now(timezone.utc).isoformat(timespec="milliseconds"))

    def json(self) -> dict:
        """
        Convierte el post en un diccionario JSON.

        Returns:
            dict: Representación JSON del post.
        """
        return {
            "ID": self.ID if self.ID else None,
            "name": self.name if self.name else None,
            "location": self.location if self.location else None,
            "review": self.review if self.review else None,
            "rating": self.rating if self.rating else None,
            "imageUrl": self.imageUrl if self.imageUrl else None,
            "creator": self.creator.json() if self.creator else None,
            "comments": self.comments if self.comments else [],
            "createdAt": self.createdAt if self.createdAt else None
        }

    def edit(self, new_info={}) -> dict:
        """
        Edita la información del post y devuelve solo los valores editados.

        Args:
            new_info (dict): La nueva información a editar.

        Returns:
            dict: Diccionario con solo los valores modificados.
        """
        edited_fields = {}

        if "name" in new_info and new_info["name"] != self.name:
            self.name = new_info["name"]
            edited_fields["name"] = self.name

        if "location" in new_info and new_info["location"] != self.location:
            self.location = new_info["location"]
            edited_fields["location"] = self.location

        if "review" in new_info and new_info["review"] != self.review:
            self.review = new_info["review"]
            edited_fields["review"] = self.review

        if "rating" in new_info and new_info["rating"] != self.rating:
            self.rating = new_info["rating"]
            edited_fields["rating"] = self.rating

        if "imageUrl" in new_info and new_info["imageUrl"] != self.imageUrl:
            self.imageUrl = new_info["imageUrl"]
            edited_fields["imageUrl"] = self.imageUrl

        return edited_fields if edited_fields else "same"


    def filter(self, request_user: User_lite=User_lite()) -> dict:
        """
        Filtra la información del post que debe ser devuelta, dependiendo del usuario que hace la solicitud.

        Args:
            request_user (User_lite): El usuario que hace la solicitud.

        Returns:
            dict: Diccionario con la información filtrada del post, incluyendo el nombre del creador
                y un campo para indicar si el post es editable por el usuario solicitante.
        """
        returned_post = self.json()
        returned_post["creator"] = self.creator.username if self.creator else None
        returned_post["editable"] = True if request_user == self.creator else False
        returned_post["comments"] = [Comment(comment).filter(request_user) for comment in returned_post["comments"]] if self.comments else []
        return returned_post