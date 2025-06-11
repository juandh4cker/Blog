from bson import ObjectId
from modules.database import DB as db
from modules.utils.generals import creation_date
from modules.users import User_lite
from typing import Any, Dict, List, Set, Optional

class Comment:
    """Initialize a comment."""    
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Initialize a Comment.

        Args:
            data (Optional[Dict[str, Any]], optional): The comment data. Defaults to None.
                - _id (ObjectId, optional): The comment ID, if isn't given create a new ID.
                - content (str): The comment text, the content.
                - rating (float): Comment rating.
                - creator (User_lite): Comment creator.
                - createdAt (str, optional): Creation date, if isn't given create a new one.

        Raises:
            ValueError: If the data types don't match.
        """        
        try:
            self.valid: bool = True
            #if not data or any(field is None for field in [data.get("content"), data.get("creator"), data.get("rating")]):
            if not data:
                self.valid = False

            else:
                self.ID: ObjectId = ObjectId(data.get("_id", ObjectId()))
                self.content: str = str(data["content"])
                self.rating: float = float(data["rating"])
                self.creator: User_lite = User_lite(data["creator"])
                self.likes: List[ObjectId] = data.get("saved", [])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error initializing the comment: {e}")
    
    def __bool__(self) -> bool:
        """
        The validity of the comment.

        Returns:
            bool: True if is valid, else False.
        """        
        return self.valid

    def json(self) -> Dict[str, Any]:
        """
        Parse the comment to JSON format.

        Returns:
            Dict[str, Any]: Comment data in JSON.
        """        
        try:
            if not self:
                raise ValueError(f"Error parsing the comment: No data was provided.")
            
            return {
                "_id": self.ID,
                "content": self.content,
                "rating": self.rating,
                "creator": self.creator.json(),
                "createdAt": self.createdAt
            }
        
        except Exception as e:
                raise ValueError(f"Error parsing the comment: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        """
        Filter a comment with this params:
        - Changes "_id" for "ID".
        - Only returns the creator username.
        - If the request user is the creator, returns "editable" as True, else False.

        Args:
            request_user (User_lite, optional): The user that fetch the comment. Defaults to User_lite().

        Raises:
            RuntimeError: Error filtering the comment.

        Returns:
            Dict[str, Any]: The comment filtered.
        """        
        try:
            returned_comment: Dict[str, Any] = self.json()
            returned_comment["ID"] = str(returned_comment.pop("_id"))
            returned_comment["creator"] = self.creator.username
            returned_comment["editable"] = True if request_user == self.creator else False
            return returned_comment

        except Exception as e:
                raise RuntimeError(f"Error filtering the comment: {e}")


class Post:
    """Initialize a post."""    
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Initialize a post.

        Args:
            data (Optional[Dict[str, Any]], optional): The post data. Defaults to None.
                - _id (ObjectId, optional): The post ID, if isn't given create a new ID.
                - name (str): Post's name.
                - location (str): Post's location.
                - review (str): Post's review.
                - rating (float): Post's rating.
                - imageUrl (str): Post's image url.
                - creator (User_lite): Post's creator.
                - comments (List[Dict[str, Any]], optional): The post's comments or [] if isn't given.
                - createdAt (str, optional): Creation date, if isn't given create a new one.
        Raises:
            ValueError: If the data types don't match.
        """        
        try:
            self.valid: bool = True
            #if not data or any(field is None for field in [data.get("name"), data.get("location"), data.get("review"), data.get("rating"), data.get("imageUrl"), data.get("creator")]):
            if not data:
                self.valid = False

            else:
                self.ID: ObjectId = ObjectId(data.get("_id", ObjectId())) 
                self.name: str = str(data["name"])
                self.location: str = str(data["location"])
                self.review: str = str(data["review"])
                self.rating: float = float(data["rating"])
                self.imageUrl: str = str(data["imageUrl"])
                self.creator: User_lite = User_lite(data["creator"])
                self.comments: List[Dict[str, Any]] = data.get("comments", [])
                self.likes: List[ObjectId] = data.get("likes", [])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error initializing the post. {e}")

    def __bool__(self) -> bool:
        """
        The validity of the post.

        Returns:
            bool: True if is valid, else False.
        """ 
        return self.valid

    def json(self) -> Dict[str, Any]:
        """
        Parse the post to JSON format.

        Returns:
            Dict[str, Any]: Post data in JSON.
        """    
        try:
            if not self:
                raise ValueError(f"Error parsing the post: No data was provided.")
            
            return {
                "_id": self.ID,
                "name": self.name,
                "location": self.location,
                "review": self.review,
                "rating": self.rating,
                "imageUrl": self.imageUrl,
                "creator": self.creator.json(),
                "comments": self.comments,
                "createdAt": self.createdAt
            }
        
        except Exception as e:
            raise ValueError(f"Error parsing the Post: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        """
        Filter a post with this params:
        - Changes "_id" for "ID".
        - Only returns the creator username.
        - If the request user is the creator, returns "editable" as True, else False.
        - Filter every comment in the comments.

        Args:
            request_user (User_lite, optional): The user that fetch the post. Defaults to User_lite().

        Raises:
            RuntimeError: Error filtering the post.

        Returns:
            Dict[str, Any]: The post filtered.
        """    
        try:
            returned_post: Dict[str, Any]  = self.json()
            returned_post["ID"] = str(returned_post.pop("_id"))
            returned_post["creator"] = self.creator.username
            returned_post["editable"] = request_user == self.creator
            returned_post["comments"] = [Comment(comment).filter(request_user) for comment in returned_post["comments"]]
            returned_post["likes"] = len(self.likes)
            returned_post["isLiking"] = True if request_user.ID in self.likes else False
            return returned_post

        except Exception as e:
            raise RuntimeError(f"Error filtering the post: {e}")

    def edit(self, new_info: Dict[str, Any] = {}) -> Dict[str, Any]:
        """
        Edit a post, only in the valid fields: "name", "location", "review", "rating", "imageUrl".

        Args:
            new_info (Dict[str, Any], optional): New post's data. Defaults to {}.

        Raises:
            RuntimeError: Error editting the post.

        Returns:
            Dict[str, Any]: The edited post.
        """        
        if not self or not new_info:
            return {}

        edited_fields: Dict[str, Any] = {}
        try:
            valid_fields: Set[str] = {"name", "location", "review", "rating", "imageUrl"}

            for key, value in new_info.items():
                if key in valid_fields and getattr(self, key, None) != value:
                    setattr(self, key, value)
                    edited_fields[key] = value

            return edited_fields

        except Exception as e:
            raise RuntimeError(f"Error editting the post: {e}")

    def lite(self) -> Dict[str, Any]:
        """
        Make a lite post version, only returns:
        - ID.
        - Name.
        - Location.
        - Rating.
        - ImageUrl.

        Returns:
            Dict[str, Any]: The lite post.
        """        
        if not self:
            raise ValueError(f"Error liting the post: No data was provided.")
        
        try:
            return {
                "ID": str(self.ID),
                "name": self.name,
                "location": self.location,
                "rating": self.rating,
                "imageUrl": self.imageUrl
            }
        except Exception as e:
            raise RuntimeError(f"Error liting the post: {e}") from e


class Posts:
    """It manages the posts an comments."""    
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
            posts: List[Dict[str, Any]] = db.get_posts()
            return posts
        
        except Exception as e:
            raise RuntimeError(f"Error fetching the posts: {e}") from e

    @classmethod
    def get_user_posts(cls, user_posts: list = []) -> List[Dict[str, Any]]:
        """
        Fetch all the posts for one user.

        Args:
            user_posts (list, optional): The ID of every post to fetch. Defaults to [].

        Raises:
            RuntimeError: Error fetching the user posts.

        Returns:
            List[Dict[str, Any]]: All user's post or [] if is empty.
        """        
        try:
            posts: List[Dict[str, Any]] = []

            for post_id in user_posts:
                lite: Dict[str, Any] = cls.get_post(post_id).lite()
                posts.append(lite)
                
            return posts
        
        except Exception as e:
            raise RuntimeError(f"Error fetching the user's posts: {e}") from e

    @classmethod
    def get_post(cls, value: Any, field: str = "_id") -> Post:
        """
        Fetch an specific post.

        Args:
            value (Any): Fetch an specific post.
            field (str, optional): Field to search. Defaults to "_id".

        Raises:
            RuntimeError: Error fetching the post.

        Returns:
            Post: The post founded.
        """        
        try:
            post: Dict[str, Any] = db.get_post(value, field)
            return Post(post)
        
        except Exception as e:
            raise RuntimeError(f"Error fetching the post: {e}") from e

    @classmethod
    def create_post(cls, name: str, location: str, review: str, rating: float, imageUrl: str, creator: User_lite) -> Post:
        """
        Create a new post.

        Args:
            name (str): Post's name.
            location (str): Post's location.
            review (str): Post's review.
            rating (float): Post's rating.
            imageUrl (str): Post's image url.
            creator (User_lite): Post's creator.

        Raises:
            RuntimeError: Error creating the post.

        Returns:
            Post: New post data if was created.
        """        
        try:
            new_post: Post = Post({
                "name": name,
                "location": location,
                "review": review,
                "rating": rating,
                "imageUrl": imageUrl,
                "creator": creator.json()
            })
            return new_post if db.add_post(new_post.json(), creator.ID) else Post()
        
        except Exception as e:
            raise RuntimeError(f"Error creating the post: {e}") from e
                
    @classmethod
    def edit_post(cls, post: Post, new_data: Dict[str, Any] = {}) -> Post:
        """
        Edit a post.

        Args:
            post (Post): The post to edit.
            new_data (Dict[str, Any], optional): New data. Defaults to {}.

        Raises:
            RuntimeError: Error editing the post.

        Returns:
            Post: Edited post if was edited.
        """        
        try:
            edited: Dict[str, Any] = post.edit(new_data)
            if edited:
                return post if db.edit_post(post.ID, edited) else Post()
            return Post()

        except Exception as e:
            raise RuntimeError(f"Error editing the post: {e}") from e
    
    @classmethod
    def delete_post(cls, post: Post) -> Post:
        """
        Delete a post

        Args:
            post (Post): The post to delete.

        Raises:
            RuntimeError: Error deleting the post.

        Returns:
            Post: Deleted post data.
        """        
        try:
            return post if db.delete_post(post.ID, post.creator.ID) else Post()
        
        except Exception as e:
            raise RuntimeError(f"Error deleting the post: {e}") from e
    
    #Comments

    @classmethod
    def __get_comments(cls, post: Post, request_user: User_lite = User_lite()) -> List[Dict[str, Any]]:
        """
        Fetch all the comments in a post.

        Args:
            post (Post): The post to fetch comments.
            request_user (User_lite, optional): The user that makes the request. Defaults to User_lite().

        Raises:
            RuntimeError: Error fetching the comments.

        Returns:
            List[Dict[str, Any]]: All the comments or [] if it don't have comments.
        """        
        try:
            db_comments: List[Dict[str, Any]] = db._get_comments(post.ID)
            comments: List[Dict[str, Any]] = []
            for comment in db_comments:
                comments.append(Comment(comment).filter(request_user))
            
            return comments
        
        except Exception as e:
            raise RuntimeError(f"Error fetching the comments: {e}") from e    

    @classmethod
    def get_comment(cls, post_id: ObjectId, comment_id: ObjectId) -> Comment:
        """
        Fetch one comment in the post.

        Args:
            post_id (ObjectId): Post'ID where is the comment.
            comment_id (ObjectId): Comment's ID to fetch.

        Raises:
            RuntimeError: Error fetching a comment.

        Returns:
            Comment: The comment fetched if it exist.
        """        
        try:
            comment: Dict[str, Any]  = db.get_comment(post_id, comment_id)
            return Comment(comment)
        
        except Exception as e:
            raise RuntimeError(f"Error fetching the comment. {e}") from e

    @classmethod
    def new_comment(cls, post: Post, content: str, rating: float, creator: User_lite) -> Comment:
        """
        Create a new comment.

        Args:
            post (Post): Post where will be the comment.
            content (str): Comment's content.
            rating (float): Comment's rating.
            creator (User_lite): Comment's creator.

        Raises:
            RuntimeError: Error creating the comment

        Returns:
            Comment: New comment data if was added.
        """        
        try:
            new_comment: Comment = Comment({
                "content": content,
                "rating": rating,
                "creator": creator.json()
            })
            return new_comment if db.add_comment(post.ID, new_comment.json()) else Comment()
        
        except Exception as e:
            raise RuntimeError(f"Error creating the comment: {e}") from e
    
    @classmethod
    def delete_comment(cls, post: Post, comment: Comment) -> Comment:
        """
        Delete a comment.

        Args:
            post (Post): Post where is the comment.
            comment (Comment): Comment to delete.

        Raises:
            RuntimeError: Error deleting the comment.

        Returns:
            Comment: Deleted comment data.
        """        
        try: 
            return comment if db.delete_comment(post.ID, comment.ID) else Comment()
        
        except Exception as e:
            raise RuntimeError(f"Error deleting the comment: {e}") from e
        
    @classmethod
    def like(self, user: User_lite, post: Post) -> bool:
        """
        Make a follow.

        Args:
            user (User_lite): User that wants to like.
            post (Post): Post that will be liked.

        Raises:
            RuntimeError: Error liking.

        Returns:
            bool: True if the operation was successfull.
        """
        try:
            return db.like(user.ID, post.ID)
        
        except Exception as e:
            raise RuntimeError(f"Error liking: {e}") from e
        
    @classmethod
    def unlike(self, user: User_lite, post: Post) -> bool:
        """
        Make a follow.

        Args:
            user (User_lite): User that wants to unlike.
            post (Post): that wants to unlike.

        Raises:
            RuntimeError: Error unliking.

        Returns:
            bool: True if the operation was successfull.
        """
        try:
            return db.unlike(user.ID, post.ID) 
        
        except Exception as e:
            raise RuntimeError(f"Error unliking: {e}") from e