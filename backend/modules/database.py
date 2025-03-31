from dotenv import load_dotenv 
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.results import InsertOneResult, UpdateResult, DeleteResult
from os import getenv
from typing import Any, Dict, List

load_dotenv()

class DB:
    """
    Clase para manejar operaciones con la base de datos MongoDB.

    Attributes:
        client (MongoClient): Cliente de MongoDB.
        db (Database): Base de datos "worldblog".
        users_collection (Collection): Colección de usuarios.
        posts_collection (Collection): Colección de posts.
    """
    MONGO_URI: str | None = getenv("MONGO_URI")
    if not MONGO_URI:
        raise ValueError("Error: MONGO_URI no está configurado en el entorno o en el archivo .env")

    __client: MongoClient = MongoClient(MONGO_URI)
    __db: Database = __client["worldblog"]
    __users_collection: Collection = __db["users"]
    __posts_collection: Collection = __db["posts"]

    # Users

    @classmethod
    def __get_users(cls) -> List[Dict[str, Any]]:
        """
        Obtiene todos los usuarios de la colección.

        Returns:
            List[Dict[str, Any]]: Lista de documentos de usuarios.
        """
        try:
            users: List[Dict[str, Any]] = list(cls.__users_collection.find())
            return users if users else []
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener usuarios: {e}") from e

    @classmethod
    def count_users(cls) -> int:
        """
        Cuenta la cantidad total de usuarios en la colección.

        Returns:
            int: Número total de usuarios.
        """
        try:
            count: int = cls.__users_collection.count_documents({})
            return count if count else 0
    
        except Exception as e:
            raise RuntimeError(f"Error al contar usuarios: {e}") from e

    @classmethod
    def get_user(cls, field: str = "_id", value: int | str = "") -> Dict[str, Any]:
        """
        Obtiene un usuario basado en un campo y su valor.

        Args:
            field (str): Campo a buscar.
            value (int | str): Valor del campo.

        Returns:
            Dict[str, Any]: Documento del usuario encontrado. Retorna un diccionario vacío si no se encuentra.
        """
        try:
            user: Dict[str, Any] | None = cls.__users_collection.find_one({f"{field}": value})
            return user if user else {}
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener usuario: {e}") from e

    @classmethod
    def add_user(cls, user: Dict[str, Any]) -> bool:
        """
        Agrega un nuevo usuario a la colección.

        Args:
            user (Dict[str, Any]): Diccionario con los datos del usuario.

        Returns:
            bool: True si el usuario se agregó correctamente, False en caso contrario.
        """
        try:
            result: InsertOneResult = cls.__users_collection.insert_one(user)
            if result.inserted_id:
                return True
            raise Exception()
    
        except Exception as e:
            raise RuntimeError(f"Error al añadir usuario: {e}") from e

    @classmethod
    def __edit_user(cls, user_id: int, data: Dict[str, Any]) -> bool:
        """
        Edita un usuario existente actualizando los campos indicados.

        Args:
            user_id (int): ID del usuario a editar.
            data (Dict[str, Any]): Diccionario con los campos a actualizar.

        Returns:
            bool: True si se actualizó el usuario, False si no hubo cambios o ocurrió un error.
        """
        try:
            result: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$set": data})
            if result.modified_count > 0:
                return True
            raise Exception()
        
        except Exception as e:
            raise RuntimeError(f"Error al editar usuario: {e}") from e

    @classmethod
    def __delete_user(cls, user_id: int) -> bool:
        """
        Elimina un usuario y sus posts de la colección.

        Args:
            user_id (int): ID del usuario a eliminar.

        Returns:
            bool: True si el usuario se eliminó, False en caso de error o si no se encontró.
        """
        try:
            user: Dict[str, Any] = cls.get_user("ID", user_id)
            user_posts: List[int] = user.get("posts", [])

            for post_id in user_posts:
                cls.delete_post(post_id, user_id)

            result: DeleteResult = cls.__users_collection.delete_one({"ID": user_id})
            if result.deleted_count > 0:
                return True
            raise Exception()

        except Exception as e:
            raise RuntimeError(f"Error al borrar usuario: {e}") from e

    # Follows

    @classmethod
    def follow(cls, follower_id: int, following_id: int) -> bool:
        """
        Establece la relación de seguimiento entre dos usuarios.

        Args:
            follower_id (int): ID del usuario que sigue.
            following_id (int): ID del usuario a seguir.

        Returns:
            bool: True si la operación se realizó correctamente, False en caso de error.
        """
        def add_follower(user_id: int, follower_id: int) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$addToSet": {"followers": follower_id}})
                if result.modified_count > 0:
                    return True
                raise Exception()
            
            except Exception as e:
                raise RuntimeError(f"Error al añadir seguidor: {e}") from e

        def add_following(user_id: int, following_id: int) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$addToSet": {"following": following_id}})
                if result.modified_count > 0:
                    return True
                raise Exception()
        
            except Exception as e:
                raise RuntimeError(f"Error al añadir siguiendo: {e}") from e

        try:
            return add_follower(follower_id, following_id) and add_following(following_id, follower_id)

        except Exception as e:
            raise RuntimeError(f"Error al seguir: {e}") from e

    @classmethod
    def unfollow(cls, follower_id: int, following_id: int) -> bool:
        """
        Elimina la relación de seguimiento entre dos usuarios.

        Args:
            follower_id (int): ID del usuario que deja de seguir.
            following_id (int): ID del usuario que era seguido.

        Returns:
            bool: True si la operación se realizó correctamente, False en caso de error.
        """
        def delete_follower(user_id: int, follower_id: int) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$pull": {"followers": follower_id}})
                if result.modified_count > 0:
                    return True
                raise Exception()
        
            except Exception as e:
                raise RuntimeError(f"Error al eliminar seguidor: {e}") from e

        def delete_following(user_id: int, following_id: int) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$pull": {"following": following_id}})
                if result.modified_count > 0:
                    return True 
                raise Exception()
        
            except Exception as e:
                raise RuntimeError(f"Error al eliminar siguiendo: {e}") from e

        try:
            return delete_follower(follower_id, following_id) and delete_following(following_id, follower_id)

        except Exception as e:
            raise RuntimeError(f"Error al dejar de seguir: {e}") from e

    #Posts

    @classmethod
    def get_posts(cls) -> List[Dict[str, Any]]:
        """
        Obtiene todos los posts de la colección.

        Returns:
            List[Dict[str, Any]]: Lista de documentos de posts.
        """
        try:
            posts: List[Dict[str, Any]] = list(cls.__posts_collection.find())
            return posts if posts else []
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener posts: {e}") from e

    @classmethod
    def count_posts(cls) -> int:
        """
        Cuenta la cantidad total de posts en la colección.

        Returns:
            int: Número total de posts. Retorna 0 en caso de error.
        """
        try:
            count: int = cls.__posts_collection.count_documents({})
            return count if count else 0
    
        except Exception as e:
            raise RuntimeError(f"Error al contar posts: {e}") from e

    @classmethod
    def get_post(cls, field: str = "_id", value: int | str = "") -> Dict[str, Any]:
        """
        Obtiene un post basado en un campo y su valor.

        Args:
            field (str): Campo a buscar. Por defecto es "_id".
            value (int | str): Valor del campo.

        Returns:
            Dict[str, Any]: Documento del post encontrado. Retorna un diccionario vacío en caso de error o si no se encuentra.
        """
        try:
            post: Dict[str, Any] | None = cls.__posts_collection.find_one({f"{field}": value})
            return post if post else {}
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener post: {e}") from e

    @classmethod
    def add_post(cls, post: Dict[str, Any], user_id: int) -> bool:
        """
        Agrega un nuevo post a la colección y lo enlaza con un usuario.

        Args:
            post (Dict[str, Any]): Diccionario con los datos del post.
            user_id (int): ID del usuario que crea el post.

        Returns:
            bool: True si el post se agregó y se enlazó correctamente, False en caso contrario.
        """
        try:
            result_1: InsertOneResult = cls.__posts_collection.insert_one(post)
            result_2: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$addToSet": {"posts": post["ID"]}})
            if result_1.inserted_id and result_2.modified_count > 0:
                return True       
            raise Exception()
    
        except Exception as e:
            raise RuntimeError(f"Error al añadir post: {e}") from e

    @classmethod
    def edit_post(cls, post_id: int, data: Dict[str, Any]) -> bool:
        """
        Edita un post existente actualizando los campos indicados.

        Args:
            post_id (int): ID del post a editar.
            data (Dict[str, Any]): Diccionario con los campos a actualizar.

        Returns:
            bool: True si se actualizó el post, False si no hubo cambios o ocurrió un error.
        """
        try:
            result: UpdateResult = cls.__posts_collection.update_one({"ID": post_id}, {"$set": data})
            if result.modified_count > 0:
                return True
            raise Exception()
    
        except Exception as e:
            raise RuntimeError(f"Error al editar post: {e}") from e

    @classmethod
    def delete_post(cls, post_id: int, user_id: int) -> bool:
        """
        Elimina un post de la colección y lo desvincula del usuario.

        Args:
            post_id (int): ID del post a eliminar.
            user_id (int): ID del usuario al que pertenece el post.

        Returns:
            bool: True si el post se eliminó y se removió del usuario, False en caso de error.
        """
        try:
            result_1: DeleteResult = cls.__posts_collection.delete_one({"ID": post_id})
            result_2: UpdateResult = cls.__users_collection.update_one({"ID": user_id}, {"$pull": {"posts": post_id}})
            if result_1.deleted_count > 0 and result_2.modified_count > 0:
                return True
            raise Exception()
    
        except Exception as e:
            raise RuntimeError(f"Error al borrar post: {e}") from e

    # Comments

    @classmethod
    def get_comments(cls, post_id: int) -> List[Dict[str, Any]]:
        """
        Obtiene todos los comentarios de un post.

        Args:
            post_id (int): ID del post a buscar comentarios.

        Returns:
            List[Dict[str, Any]]: Lista de comentarios.
        """
        try:
            post: Dict[str, Any] = cls.get_post("ID", post_id)
            return post.get("comments", []) if post else []
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener comentarios: {e}") from e

    @classmethod
    def count_comments(cls, post_id: int) -> int:
        """
        Cuenta la cantidad de comentarios de un post.

        Args:
            post_id (int): ID del post donde está el comentario.

        Returns:
            int: Número de comentarios.
        """
        try:
            comments: List[Dict[str, Any]] = cls.get_comments(post_id)
            return len(comments) if comments else 0
    
        except Exception as e:
            raise RuntimeError(f"Error al contar comentarios: {e}") from e

    @classmethod
    def get_comment(cls, post_id: int, comment_id: int) -> Dict[str, Any]:
        """
        Obtiene un comentario específico de un post.

        Args:
            post_id (int): ID del post donde está el comentario.
            comment_id (int): ID del comentario.

        Returns:
            Dict[str, Any]: Comentario encontrado. Retorna un diccionario vacío en caso de error o si no se encuentra.
        """
        try:
            post: Dict[str, Any] | None  = cls.__posts_collection.find_one(
                {"ID": post_id, "comments.ID": comment_id},
                {"comments.$": 1}
            )
            comment: Dict[str, Any] | None  = post.get("comments", [None])[0] if post else None
            return comment if comment else {}
       
        except Exception as e:
            raise RuntimeError(f"Error al obtener comentario: {e}") from e

    @classmethod
    def add_comment(cls, post_id: int, comment: Dict[str, Any]) -> bool:
        """
        Agrega un comentario a un post.

        Args:
            post_id (int): ID del post donde está el comentario.
            comment (Dict[str, Any]): Diccionario con los datos del comentario.

        Returns:
            bool: True si el comentario se agregó correctamente, False en caso de error.
        """
        try:
            result: UpdateResult = cls.__posts_collection.update_one(
                {"ID": post_id},
                {"$push": {"comments": comment}}
            )
            if result.modified_count > 0:
                return True
            raise Exception()
    
        except Exception as e:
            raise RuntimeError(f"Error al añadir comentario: {e}") from e

    @classmethod
    def delete_comment(cls, post_id: int, comment_id: int) -> bool:
        """
        Elimina un comentario de un post.

        Args:
            post_id (int): ID del post donde está el comentario.
            comment_id (int): ID del comentario a eliminar.

        Returns:
            bool: True si el comentario se eliminó, False en caso de error o si no se encontró.
        """
        try:
            result: UpdateResult = cls.__posts_collection.update_one(
                {"ID": int(post_id)},
                {"$pull": {"comments": {"ID": int(comment_id)}}}
            )
            if result.modified_count > 0:
                return True
            raise Exception()
    
        except Exception as e:
            raise RuntimeError(f"Error al borrar comentario: {e}") from e