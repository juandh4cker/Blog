from pymongo import MongoClient
from os import getenv

#Añadir exceptions y testing (que cumplan el formato o tipo para poder ser ingresados)

class Database:
    """
    Clase para manejar operaciones con la base de datos MongoDB para el proyecto worldblog.

    Atributos:
        client (MongoClient): Cliente de MongoDB.
        db: Base de datos "worldblog".
        posts_colection: Colección de posts.
        users_colection: Colección de usuarios.
    """
    def __init__(self):
        """
        Inicializa la conexión a la base de datos utilizando la variable de entorno MONGO_URI.
        """
        self.client = MongoClient(getenv("MONGO_URI", "mongodb://admin:password@mongodb:27017/worldblog?authSource=admin"))
        self.db = self.client["worldblog"]
        self.posts_colection = self.db["posts"]
        self.users_colection = self.db["users"]

    # Users

    def get_users(self) -> list:
        """
        Obtiene todos los usuarios de la colección.

        Returns:
            list: Lista de documentos de usuarios. Si ocurre un error, retorna una lista vacía.
        """
        try:
            users = list(self.users_colection.find())
            return users
        except Exception as e:
            return []

    def count_users(self) -> int:
        """
        Cuenta la cantidad total de usuarios en la colección.

        Returns:
            int: Número total de usuarios. Retorna 0 en caso de error.
        """
        try:
            count = self.users_colection.count_documents({})
            return count
        except Exception as e:
            return 0

    def get_user(self, field: str = "_id", value: int | str = None) -> dict:
        """
        Obtiene un usuario basado en un campo y su valor.

        Args:
            field (str): Campo a buscar. Por defecto es "_id".
            value (int | str): Valor del campo.

        Returns:
            dict: Documento del usuario encontrado. Retorna un diccionario vacío en caso de error o si no se encuentra.
        """
        try:
            user = self.users_colection.find_one({f"{field}": value})
            return user if user else {}
        except Exception as e:
            return {}

    def add_user(self, user: dict) -> bool:
        """
        Agrega un nuevo usuario a la colección.

        Args:
            user (dict): Diccionario con los datos del usuario.

        Returns:
            bool: True si el usuario se agregó correctamente, False en caso contrario.
        """
        try:
            result = self.users_colection.insert_one(user)
            if result.inserted_id:
                return True
            else:
                return False
        except Exception as e:
            return False

    def edit_user(self, user_id: int, data: dict) -> bool:
        """
        Edita un usuario existente actualizando los campos indicados.

        Args:
            user_id (int): ID del usuario a editar.
            data (dict): Diccionario con los campos a actualizar.

        Returns:
            bool: True si se actualizó el usuario, False si no hubo cambios o ocurrió un error.
        """
        try:
            result = self.users_colection.update_one({"ID": user_id}, {"$set": data})
            if result.modified_count > 0:
                return True
            else:
                return False
        except Exception as e:
            return False

    def delete_user(self, user_id: int) -> bool:
        """
        Elimina un usuario de la colección.

        Args:
            user_id (int): ID del usuario a eliminar.

        Returns:
            bool: True si el usuario se eliminó, False en caso de error o si no se encontró.
        """
        try:
            result = self.users_colection.delete_one({"ID": user_id})
            if result.deleted_count > 0:
                return True
            else:
                return False
        except Exception as e:
            return False

    # Follows

    def follow(self, follower_id: int, following_id: int) -> bool:
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
                result = self.users_colection.update_one({"ID": user_id}, {"$addToSet": {"followers": follower_id}})
                if result.modified_count > 0:
                    return True
                else:
                    return False
            except Exception as e:
                return False

        def add_following(user_id: int, following_id: int) -> bool:
            try:
                result = self.users_colection.update_one({"ID": user_id}, {"$addToSet": {"following": following_id}})
                if result.modified_count > 0:
                    return True
                else:
                    return False
            except Exception as e:
                return False

        return add_follower(follower_id, following_id) and add_following(following_id, follower_id)

    def unfollow(self, follower_id: int, following_id: int) -> bool:
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
                result = self.users_colection.update_one({"ID": user_id}, {"$pull": {"followers": follower_id}})
                if result.modified_count > 0:
                    return True
                else:
                    return False
            except Exception as e:
                return False

        def delete_following(user_id: int, following_id: int) -> bool:
            try:
                result = self.users_colection.update_one({"ID": user_id}, {"$pull": {"following": following_id}})
                if result.modified_count > 0:
                    return True
                else:
                    return False
            except Exception as e:
                return False

        return delete_follower(follower_id, following_id) and delete_following(following_id, follower_id)

    #Posts

    def get_posts(self) -> list:
        """
        Obtiene todos los posts de la colección.

        Returns:
            list: Lista de documentos de posts. Retorna una lista vacía en caso de error.
        """
        try:
            posts = list(self.posts_colection.find())
            return posts
        except Exception as e:
            return []

    def count_posts(self) -> int:
        """
        Cuenta la cantidad total de posts en la colección.

        Returns:
            int: Número total de posts. Retorna 0 en caso de error.
        """
        try:
            count = self.posts_colection.count_documents({})
            return count
        except Exception as e:
            return 0

    def get_post(self, field: str = "_id", value: int | str = None) -> dict:
        """
        Obtiene un post basado en un campo y su valor.

        Args:
            field (str): Campo a buscar. Por defecto es "_id".
            value (int | str): Valor del campo.

        Returns:
            dict: Documento del post encontrado. Retorna un diccionario vacío en caso de error o si no se encuentra.
        """
        try:
            post = self.posts_colection.find_one({f"{field}": value})
            return post if post else {}
        except Exception as e:
            return {}

    def add_post(self, post: dict, user_id: int) -> bool:
        """
        Agrega un nuevo post a la colección y lo enlaza con un usuario.

        Args:
            post (dict): Diccionario con los datos del post.
            user_id (int): ID del usuario que crea el post.

        Returns:
            bool: True si el post se agregó y se enlazó correctamente, False en caso contrario.
        """
        try:
            result_1 = self.posts_colection.insert_one(post)
            result_2 = self.users_colection.update_one({"ID": user_id}, {"$addToSet": {"posts": post["ID"]}})
            if result_1.inserted_id and result_2.modified_count > 0:
                return True
            else:
                return False
        except Exception as e:
            return False

    def edit_post(self, post_id: int, data: dict) -> bool: #???
        """
        Edita un post existente actualizando los campos indicados.

        Args:
            post_id (int): ID del post a editar.
            data (dict): Diccionario con los campos a actualizar.

        Returns:
            bool: True si se actualizó el post, False si no hubo cambios o ocurrió un error.
        """
        try:
            result = self.posts_colection.update_one({"ID": post_id}, {"$set": data})
            if result.modified_count > 0:
                return True
            else:
                return False
        except Exception as e:
            return False

    def delete_post(self, post_id: int, user_id: int) -> bool:
        """
        Elimina un post de la colección y lo desvincula del usuario.

        Args:
            post_id (int): ID del post a eliminar.
            user_id (int): ID del usuario al que pertenece el post.

        Returns:
            bool: True si el post se eliminó y se removió del usuario, False en caso de error.
        """
        try:
            result_1 = self.posts_colection.delete_one({"ID": post_id})
            result_2 = self.users_colection.update_one({"ID": user_id}, {"$pull": {"posts": post_id}})
            if result_1.deleted_count > 0 and result_2.modified_count > 0:
                return True
            else:
                return False
        except Exception as e:
            return False

    # Comments

    def get_comments(self, post_id: int) -> list:
        """
        Obtiene todos los comentarios de un post.

        Args:
            post_id (int): ID del post.

        Returns:
            list: Lista de comentarios. Retorna una lista vacía en caso de error.
        """
        try:
            post = self.posts_colection.find_one({"ID": post_id}, {"comments": 1, "_id": 0})
            comments = post.get("comments", []) if post else []
            return comments
        except Exception as e:
            return []

    def count_comments(self, post_id: int) -> int:
        """
        Cuenta la cantidad de comentarios de un post.

        Args:
            post_id (int): ID del post.

        Returns:
            int: Número de comentarios. Retorna 0 en caso de error.
        """
        try:
            comments = self.get_comments(post_id)
            return len(comments)
        except Exception as e:
            return 0

    def get_comment(self, post_id: int, comment_id: int) -> dict:
        """
        Obtiene un comentario específico de un post.

        Args:
            post_id (int): ID del post.
            comment_id (int): ID del comentario.

        Returns:
            dict: Comentario encontrado. Retorna un diccionario vacío en caso de error o si no se encuentra.
        """
        try:
            post = self.posts_colection.find_one(
                {"ID": post_id, "comments.ID": comment_id},
                {"comments.$": 1}
            )
            comment = post.get("comments", [None])[0] if post else None
            return comment if comment is not None else {}
        except Exception as e:
            return {}

    def add_comment(self, post_id: int, comment: dict) -> bool:
        """
        Agrega un comentario a un post.

        Args:
            post_id (int): ID del post.
            comment (dict): Diccionario con los datos del comentario.

        Returns:
            bool: True si el comentario se agregó correctamente, False en caso de error.
        """
        try:
            result = self.posts_colection.update_one(
                {"ID": post_id},
                {"$push": {"comments": comment}}
            )
            if result.modified_count > 0:
                return True
            return False
        except Exception as e:
            return False

    def delete_comment(self, post_id: int, comment_id: int) -> bool:
        """
        Elimina un comentario de un post.

        Args:
            post_id (int): ID del post.
            comment_id (int): ID del comentario a eliminar.

        Returns:
            bool: True si el comentario se eliminó, False en caso de error o si no se encontró.
        """
        try:
            result = self.posts_colection.update_one(
                {"ID": int(post_id)},
                {"$pull": {"comments": {"ID": int(comment_id)}}}
            )
            if result.modified_count > 0:
                return True
            else:
                return False
        except Exception as e:
            return False

database = Database()