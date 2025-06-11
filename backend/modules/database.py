from bson import ObjectId
from dotenv import load_dotenv 
from os import getenv
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.results import InsertOneResult, UpdateResult, DeleteResult
from typing import Any, Dict, List, Optional

load_dotenv()

class DB:
    """
    Manage the app database.
    
    Args:
        MONGO_URI (str): Uniform Resource Identifier.
        __client (MongoClient): The MongoDB client.
        __db (Database): The app database.
        __users_collection: The collections where are all the users.
        __posts_collection: The collections where are all the posts.
    """
    MONGO_URI: str = getenv("MONGO_URI") or ""
    if not MONGO_URI:
        raise ValueError("Error: MONGO_URI isn't is configured in the env.")

    __client: MongoClient = MongoClient(MONGO_URI)
    __db: Database = __client["worldblog"]
    __users_collection: Collection = __db["users"]
    __posts_collection: Collection = __db["posts"]

    # Users

    @classmethod
    def __get_users(cls) -> List[Dict[str, Any]]:
        """
        Fetch all the users in the app.

        Raises:
            RuntimeError: Error fetching the users.

        Returns:
            List[Dict[str, Any]]: All the users.
        """        
        try:
            users: List[Dict[str, Any]] = list(cls.__users_collection.find())
            return users if users else []
    
        except Exception as e:
            raise RuntimeError(f"Error fetching the users: {e}") from e

    @classmethod
    def __count_users(cls) -> int:
        """
        Count the numbers of users in the app.

        Raises:
            RuntimeError: Error counting the users.

        Returns:
            int: Number of users.
        """        
        try:
            count: int = cls.__users_collection.count_documents({})
            return count if count else 0
    
        except Exception as e:
            raise RuntimeError(f"Error counting the users: {e}") from e
        
    @classmethod
    def get_user(cls, value: Any, field: str = "_id") -> Dict[str, Any]:
        """
        Fetch a user.

        Args:
            value (Any): The value of the field to search.
            field (str, optional): The field to search. Defaults to "_id".

        Raises:
            RuntimeError: Error fetching the user.

        Returns:
            Dict[str, Any]: The user if is founded, else {}.
        """        
        try:
            value = ObjectId(value) if field == "_id" else value
            user: Dict[str, Any] | None = cls.__users_collection.find_one({f"{field}": value})
            return user if user else {}
    
        except Exception as e:
            raise RuntimeError(f"Error fetching the user: {e}") from e

    @classmethod
    def add_user(cls, user: Dict[str, Any]) -> bool:
        """
        Add a user in the database.

        Args:
            user (Dict[str, Any]): User info.

        Raises:
            RuntimeError: Error adding the user.

        Returns:
            bool: True if the user was added.
        """        
        try:
            result: InsertOneResult = cls.__users_collection.insert_one(user)

            if result.inserted_id:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error adding the user: {e}") from e

    @classmethod
    def __edit_user(cls, user_id: ObjectId , data: Dict[str, Any]) -> bool:
        """
        Edit a user in the database.

        Args:
            user_id (ObjectId): User's ID.
            data (Dict[str, Any]): New data.

        Raises:
            RuntimeError: Error editing the user.

        Returns:
            bool: True if the user was edited.
        """     
        try:
            result: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$set": data})

            if result.modified_count > 0:
                return True
            raise Exception("Unknown error")
        
        except Exception as e:
            raise RuntimeError(f"Error editing the user: {e}") from e

    @classmethod
    def __delete_user(cls, user_id: ObjectId ) -> bool:
        """
        Delete a user in the database.

        Args:
            user_id (ObjectId): User's ID.

        Raises:
            RuntimeError: Error deleting the user.

        Returns:
            bool: True if the user was deleted.
        """        
        try:
            user: Dict[str, Any] = cls.get_user(user_id)
            user_posts: List[ObjectId] = user.get("posts", [])

            for post_id in user_posts:
                cls.delete_post(post_id, user_id)

            result: DeleteResult = cls.__users_collection.delete_one({"_id": user_id})

            if result.deleted_count > 0:
                return True
            raise Exception("Unknown error")

        except Exception as e:
            raise RuntimeError(f"Error deleting the user: {e}") from e

    # Follows

    @classmethod
    def follow(cls, follower_id: ObjectId , following_id: ObjectId ) -> bool:
        """
        Make a follow.

        Args:
            follower_id (ObjectId): User that wants to follow.
            following_id (ObjectId): User that will be followed.

        Returns:
            bool: True if the operation was successful.
        """        
        def add_follower(following_id: ObjectId , follower_id: ObjectId ) -> bool:
            """
            Add a follower.

            Args:
                following_id (ObjectId): User to whom a follower is to be added.
                follower_id (ObjectId): Folloller's ID to be added.

            Raises:
                RuntimeError: If the operation was bad.

            Returns:
                bool: True if the operation was successful.
            """            
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": following_id}, {"$addToSet": {"followers": follower_id}})
                
                if result.modified_count > 0:
                    return True
                raise Exception("Unknown error")
            
            except Exception as e:
                raise RuntimeError(f"Error adding follower: {e}") from e

        def add_following(follower_id: ObjectId , following_id: ObjectId ) -> bool:
            """
            Add a following.

            Args:
                follower_id (ObjectId): User to whom a following is to be added.
                following_id (ObjectId): Following's ID to be added.

            Raises:
                RuntimeError: If the operation was bad.

            Returns:
                bool: True if the operation was successful.
            """            
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": follower_id}, {"$addToSet": {"following": following_id}})

                if result.modified_count > 0:
                    return True
                raise Exception("Unknown error")
        
            except Exception as e:
                raise RuntimeError(f"Error adding following: {e}") from e

        try:
            return add_follower(following_id, follower_id) and add_following(follower_id, following_id)

        except Exception as e:
            raise RuntimeError(f"Error following: {e}") from e

    @classmethod
    def unfollow(cls, follower_id: ObjectId , following_id: ObjectId ) -> bool:
        """
        Make a unfollow.

        Args:
            follower_id (ObjectId): User that wants to unfollow.
            following_id (ObjectId): User that will be unfollowed.

        Returns:
            bool: True if the operation was successful.
        """  
        def delete_follower(following_id: ObjectId , follower_id: ObjectId ) -> bool:
            """
            Delete a follower.

            Args:
                following_id (ObjectId): User to whom a follower is to be deleted.
                follower_id (ObjectId): Folloller's ID to be deleted.

            Raises:
                RuntimeError: If the operation was bad.

            Returns:
                bool: True if the operation was successful.
            """    
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": following_id}, {"$pull": {"followers": follower_id}})
                
                if result.modified_count > 0:
                    return True
                raise Exception("Unknown error")
        
            except Exception as e:
                raise RuntimeError(f"Error deleting follower: {e}") from e

        def delete_following(follower_id: ObjectId , following_id: ObjectId ) -> bool:
            """
            Delete a following.

            Args:
                follower_id (ObjectId): User to whom a following is to be Deleted.
                following_id (ObjectId): Following's ID to be Deleted.

            Raises:
                RuntimeError: If the operation was bad.

            Returns:
                bool: True if the operation was successful.
            """    
            try:
                result: UpdateResult = cls.__users_collection.update_one({"_id": follower_id}, {"$pull": {"following": following_id}})
                
                if result.modified_count > 0:
                    return True 
                raise Exception("Unknown error")
        
            except Exception as e:
                raise RuntimeError(f"Error deleting following: {e}") from e

        try:
            return delete_follower(following_id, follower_id) and delete_following(follower_id, following_id)

        except Exception as e:
            raise RuntimeError(f"Error unfollowing: {e}") from e

    #Likes
    
    @classmethod
    def like(cls, user_id: ObjectId, post_id: ObjectId):
        """
        Add a Like.

        Args:
            user_id (ObjectId): User who want to like something.
            post_id (ObjectId): Post ID to be liked.

        Raises:
            RuntimeError: If the operation was bad.

        Returns:
            bool: True if the operation was successful.
        """            
        try:
            result_1: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$addToSet": {"likes": post_id}})
            result_2: UpdateResult = cls.__posts_collection.update_one({"_id": post_id}, {"$addToSet": {"likes": user_id}})

            if result_1.modified_count > 0 and result_2.modified_count > 0:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error liking: {e}") from e
    
    @classmethod      
    def unlike(cls, user_id: ObjectId, post_id: ObjectId):
        """
        Delete a like.

        Args:
            user_id (ObjectId): User to who want to delete a like.
            post_id (ObjectId): Post ID to be unliked.

        Raises:
            RuntimeError: If the operation was bad.

        Returns:
            bool: True if the operation was successful.
        """    
        try:
            result_1: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$pull": {"likes": post_id}})
            result_2: UpdateResult = cls.__posts_collection.update_one({"_id": post_id}, {"$pull": {"likes": user_id}})

            if result_1.modified_count > 0 and result_2.modified_count > 0:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error unliking: {e}") from e

    #Posts

    @classmethod
    def get_posts(cls) -> List[Dict[str, Any]]:
        """
        Fetch all the posts in the database.

        Raises:
            RuntimeError: Error fetching the posts.

        Returns:
            List[Dict[str, Any]]: All posts.
        """        
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
            raise RuntimeError(f"Error fetching the posts: {e}") from e

    @classmethod
    def __count_posts(cls) -> int:
        """
        Count the posts in the database.

        Raises:
            RuntimeError: Error counting the posts.

        Returns:
            int: Number of posts.
        """        
        try:
            count: int = cls.__posts_collection.count_documents({})
            return count if count else 0
    
        except Exception as e:
            raise RuntimeError(f"Error counting the posts: {e}") from e

    @classmethod
    def get_post(cls, value: Any, field: str = "_id") -> Dict[str, Any]:
        """
        Fetch an specific post.

        Args:
            value (Any): Fetch an specific post.
            field (str, optional): Field to search. Defaults to "_id".

        Raises:
            RuntimeError: Error fetching the post.

        Returns:
            Dict[str, Any]: Post if is found, else {}.
        """        
        try:
            value = ObjectId(value) if field == "_id" else value
            post: Dict[str, Any] | None = cls.__posts_collection.find_one({f"{field}": value})
            return post if post else {}
    
        except Exception as e:
            raise RuntimeError(f"Error fetching the post: {e}") from e

    @classmethod
    def add_post(cls, post: Dict[str, Any], user_id: ObjectId ) -> bool:
        """
        Add a post in the database.

        Args:
            post (Dict[str, Any]): Post info.
            user_id (ObjectId): Post Creator ID.

        Raises:
            RuntimeError: Error adding the post.

        Returns:
            bool: True if the post was added.
        """        
        try:
            result_1: InsertOneResult = cls.__posts_collection.insert_one(post)
            result_2: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$addToSet": {"posts": post["_id"]}})
            
            if result_1.inserted_id and result_2.modified_count > 0:
                return True       
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error adding the post: {e}") from e

    @classmethod
    def edit_post(cls, post_id: ObjectId , data: Dict[str, Any]) -> bool:
        """
        Edit a post in the database.

        Args:
            post_id (ObjectId): Post's ID.
            data (Dict[str, Any]): New data.

        Raises:
            RuntimeError: Error editing the post.

        Returns:
            bool: True if the post was edited.
        """        
        try:
            result: UpdateResult = cls.__posts_collection.update_one({"_id": post_id}, {"$set": data})

            if result.modified_count > 0:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error editing the post: {e}") from e

    @classmethod
    def delete_post(cls, post_id: ObjectId , user_id: ObjectId ) -> bool:
        """
        Delete a post in the database.

        Args:
            post_id (ObjectId): Post's ID.
            user_id (ObjectId): Post creator ID.

        Raises:
            RuntimeError: Error deleting the post.

        Returns:
            bool: True if the post was deleted.
        """        
        try:
            result_1: DeleteResult = cls.__posts_collection.delete_one({"_id": post_id})
            result_2: UpdateResult = cls.__users_collection.update_one({"_id": user_id}, {"$pull": {"posts": post_id}})

            if result_1.deleted_count > 0 and result_2.modified_count > 0:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error deleting the post: {e}") from e

    # Comments

    @classmethod
    def _get_comments(cls, post_id: ObjectId ) -> List[Dict[str, Any]]:
        """
        Fetch all the comments in a post.

        Args:
            post_id (ObjectId): The post's ID which the comments will be fetched.

        Raises:
            RuntimeError: Error fetching the comments.

        Returns:
            List[Dict[str, Any]]: All the comments or [] if it don't have comments.
        """        
        try:
            post: Dict[str, Any] = cls.get_post(post_id)
            return post.get("comments", []) if post else []
    
        except Exception as e:
            raise RuntimeError(f"Error fetching the comments: {e}") from e

    @classmethod
    def __count_comments(cls, post_id: ObjectId ) -> int:
        """
        Count all the comments in a post

        Args:
            post_id (ObjectId): The post's ID which the comments will be counted.

        Raises:
            RuntimeError: Error counting the comments.

        Returns:
            int: Number of comments in a post.
        """        
        try:
            comments: List[Dict[str, Any]] = cls._get_comments(post_id)
            return len(comments) if comments else 0
    
        except Exception as e:
            raise RuntimeError(f"Error counting the comments: {e}") from e

    @classmethod
    def get_comment(cls, post_id: ObjectId , comment_id: ObjectId ) -> Dict[str, Any]:
        """
        Fetch one comment in the post.

        Args:
            post_id (ObjectId): The post's ID which the comment will be fetched.
            comment_id (ObjectId): The comment's ID.

        Raises:
            RuntimeError: Error fetching a comment.

        Returns:
            Dict[str, Any]: The comment or {} if not found.
        """
        try:
            post: Dict[str, Any] | None  = cls.__posts_collection.find_one(
                {"_id": post_id, "comments._id": comment_id},
                {"comments.$": 1}
            )
            comment: Dict[str, Any] | None  = post.get("comments", [None])[0] if post else None
            return comment if comment else {}
       
        except Exception as e:
            raise RuntimeError(f"Error fetching the comment: {e}") from e

    @classmethod
    def add_comment(cls, post_id: ObjectId , comment: Dict[str, Any]) -> bool:
        """
        Add a comment in the post.

        Args:
            post_id (ObjectId): The post's ID which the comment will be added.
            comment (Dict[str, Any]): The comment data.

        Raises:
            RuntimeError: Error adding the comment.

        Returns:
            bool: True if was added.
        """        
        try:
            result: UpdateResult = cls.__posts_collection.update_one(
                {"_id": post_id},
                {"$push": {"comments": comment}}
            )

            if result.modified_count > 0:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error adding the comment: {e}") from e

    @classmethod
    def delete_comment(cls, post_id: ObjectId , comment_id: ObjectId ) -> bool:
        """
        Delete a comment.

        Args:
            post_id (ObjectId): The post's ID which the comment will be deleted.
            comment_id (ObjectId): The comment's ID that will be deleted.

        Raises:
            RuntimeError: Error deleting the comment.

        Returns:
            bool: True if was deteled.
        """        
        try:
            result: UpdateResult = cls.__posts_collection.update_one(
                {"_id": post_id},
                {"$pull": {"comments": {"_id": comment_id}}}
            )

            if result.modified_count > 0:
                return True
            raise Exception("Unknown error")
    
        except Exception as e:
            raise RuntimeError(f"Error deleting the comment: {e}") from e