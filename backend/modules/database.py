from bson import ObjectId
from dotenv import load_dotenv 
from os import getenv
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.results import InsertOneResult, UpdateResult, DeleteResult
from typing import Any, Dict, List

load_dotenv()

class DB:
    MONGO_URI: str = getenv("MONGO_URI") or ""
    if not MONGO_URI:
        raise ValueError("Error: MONGO_URI no está configurado en el entorno o en el archivo .env")

    __client: MongoClient = MongoClient(MONGO_URI)
    __db: Database = __client["worldblog"]
    __users_collection: Collection = __db["users"]
    __posts_collection: Collection = __db["posts"]

    # Users

    @classmethod
    def _get_users(cls) -> List[Dict[str, Any]]: #__
        try:
            users: List[Dict[str, Any]] = list(cls.__users_collection.find())
            return users if users else []
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener usuarios: {e}") from e

    @classmethod
    def __count_users(cls) -> int:
        try:
            count: int = cls.__users_collection.count_documents({})
            return count if count else 0
    
        except Exception as e:
            raise RuntimeError(f"Error al contar usuarios: {e}") from e
        
    @classmethod
    def get_user(cls, value: Any, field: str = "_id") -> Dict[str, Any]:
        try:
            value = ObjectId(value) if field == "_id" else value
            user: Dict[str, Any] | None = cls.__users_collection.find_one({f"{field}": value})
            return user if user else {}
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener usuario: {e}") from e

    @classmethod
    def add_user(cls, user: Dict[str, Any]) -> bool:
        try:
            result: InsertOneResult = cls.__users_collection.insert_one(user)

            if result.inserted_id:
                return True
            raise Exception("Error desconocido")
    
        except Exception as e:
            raise RuntimeError(f"Error al añadir usuario: {e}") from e

    @classmethod
    def __edit_user(cls, user_id: ObjectId , data: Dict[str, Any]) -> bool:
        try:
            result: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$set": data})

            if result.modified_count > 0:
                return True
            raise Exception("Error desconocido")
        
        except Exception as e:
            raise RuntimeError(f"Error al editar usuario: {e}") from e

    @classmethod
    def __delete_user(cls, user_id: ObjectId ) -> bool:
        try:
            user: Dict[str, Any] = cls.get_user(user_id)
            user_posts: List[ObjectId] = user.get("posts", [])

            for post_id in user_posts:
                cls.delete_post(post_id, user_id)

            result: DeleteResult = cls.__users_collection.delete_one({"_id": user_id})

            if result.deleted_count > 0:
                return True
            raise Exception("Error desconocido")

        except Exception as e:
            raise RuntimeError(f"Error al borrar usuario: {e}") from e

    # Follows

    @classmethod
    def follow(cls, follower_id: ObjectId , following_id: ObjectId ) -> bool:
        def add_follower(following_id: ObjectId , follower_id: ObjectId ) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": following_id}, {"$addToSet": {"followers": follower_id}})
                
                if result.modified_count > 0:
                    return True
                raise Exception("Error desconocido")
            
            except Exception as e:
                raise RuntimeError(f"Error al añadir seguidor: {e}") from e

        def add_following(follower_id: ObjectId , following_id: ObjectId ) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": follower_id}, {"$addToSet": {"following": following_id}})

                if result.modified_count > 0:
                    return True
                raise Exception("Error desconocido")
        
            except Exception as e:
                raise RuntimeError(f"Error al añadir siguiendo: {e}") from e

        try:
            return add_follower(following_id, follower_id) and add_following(follower_id, following_id)

        except Exception as e:
            raise RuntimeError(f"Error al seguir: {e}") from e

    @classmethod
    def unfollow(cls, follower_id: ObjectId , following_id: ObjectId ) -> bool:
        def delete_follower(following_id: ObjectId , follower_id: ObjectId ) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": following_id}, {"$pull": {"followers": follower_id}})
                
                if result.modified_count > 0:
                    return True
                raise Exception("Error desconocido")
        
            except Exception as e:
                raise RuntimeError(f"Error al eliminar seguidor: {e}") from e

        def delete_following(follower_id: ObjectId , following_id: ObjectId ) -> bool:
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": follower_id}, {"$pull": {"following": following_id}})
                
                if result.modified_count > 0:
                    return True 
                raise Exception("Error desconocido")
        
            except Exception as e:
                raise RuntimeError(f"Error al eliminar siguiendo: {e}") from e

        try:
            return delete_follower(following_id, follower_id) and delete_following(follower_id, following_id)

        except Exception as e:
            raise RuntimeError(f"Error al dejar de seguir: {e}") from e

    #Posts

    @classmethod
    def get_posts(cls) -> List[Dict[str, Any]]:
        try:
            projection: Dict[str, int] = {
            "_id": 1,
            "name": 1,
            "location": 1,
            "rating": 1,
            "imageUrl": 1,
            }
            posts: List[Dict[str, Any]] = list(cls.__posts_collection.find({}, projection))
            return [
                {**{k: v for k, v in post.items() if k != "_id"}, "ID": str(post["_id"])}
                for post in posts
            ]
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener posts: {e}") from e

    @classmethod
    def __count_posts(cls) -> int:
        try:
            count: int = cls.__posts_collection.count_documents({})
            return count if count else 0
    
        except Exception as e:
            raise RuntimeError(f"Error al contar posts: {e}") from e

    @classmethod
    def get_post(cls, value: Any, field: str = "_id") -> Dict[str, Any]:
        try:
            value = ObjectId(value) if field == "_id" else value
            post: Dict[str, Any] | None = cls.__posts_collection.find_one({f"{field}": value})
            return post if post else {}
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener post: {e}") from e

    @classmethod
    def add_post(cls, post: Dict[str, Any], user_id: ObjectId ) -> bool:
        try:
            result_1: InsertOneResult = cls.__posts_collection.insert_one(post)
            result_2: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$addToSet": {"posts": post["_id"]}})
            
            if result_1.inserted_id and result_2.modified_count > 0:
                return True       
            raise Exception("Error desconocido")
    
        except Exception as e:
            raise RuntimeError(f"Error al añadir post: {e}") from e

    @classmethod
    def edit_post(cls, post_id: ObjectId , data: Dict[str, Any]) -> bool:
        try:
            result: UpdateResult = cls.__posts_collection.update_one({"_id": post_id}, {"$set": data})

            if result.modified_count > 0:
                return True
            raise Exception("Error desconocido")
    
        except Exception as e:
            raise RuntimeError(f"Error al editar post: {e}") from e

    @classmethod
    def delete_post(cls, post_id: ObjectId , user_id: ObjectId ) -> bool:
        try:
            result_1: DeleteResult = cls.__posts_collection.delete_one({"_id": post_id})
            result_2: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$pull": {"posts": post_id}})

            if result_1.deleted_count > 0 and result_2.modified_count > 0:
                return True
            raise Exception("Error desconocido")
    
        except Exception as e:
            raise RuntimeError(f"Error al borrar post: {e}") from e

    # Comments

    @classmethod
    def _get_comments(cls, post_id: ObjectId ) -> List[Dict[str, Any]]:
        try:
            post: Dict[str, Any] = cls.get_post(post_id)
            return post.get("comments", []) if post else []
    
        except Exception as e:
            raise RuntimeError(f"Error al obtener comentarios: {e}") from e

    @classmethod
    def __count_comments(cls, post_id: ObjectId ) -> int:
        try:
            comments: List[Dict[str, Any]] = cls._get_comments(post_id)
            return len(comments) if comments else 0
    
        except Exception as e:
            raise RuntimeError(f"Error al contar comentarios: {e}") from e

    @classmethod
    def get_comment(cls, post_id: ObjectId , comment_id: ObjectId ) -> Dict[str, Any]:
        try:
            post: Dict[str, Any] | None  = cls.__posts_collection.find_one(
                {"_id": post_id, "comments._id": comment_id},
                {"comments.$": 1}
            )
            comment: Dict[str, Any] | None  = post.get("comments", [None])[0] if post else None
            return comment if comment else {}
       
        except Exception as e:
            raise RuntimeError(f"Error al obtener comentario: {e}") from e

    @classmethod
    def add_comment(cls, post_id: ObjectId , comment: Dict[str, Any]) -> bool:
        try:
            result: UpdateResult = cls.__posts_collection.update_one(
                {"_id": post_id},
                {"$push": {"comments": comment}}
            )

            if result.modified_count > 0:
                return True
            raise Exception("Error desconocido")
    
        except Exception as e:
            raise RuntimeError(f"Error al añadir comentario: {e}") from e

    @classmethod
    def delete_comment(cls, post_id: ObjectId , comment_id: ObjectId ) -> bool:
        try:
            result: UpdateResult = cls.__posts_collection.update_one(
                {"_id": post_id},
                {"$pull": {"comments": {"_id": comment_id}}}
            )

            if result.modified_count > 0:
                return True
            raise Exception("Error desconocido")
    
        except Exception as e:
            raise RuntimeError(f"Error al borrar comentario: {e}") from e