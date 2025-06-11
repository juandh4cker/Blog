from bson import ObjectId
from modules.database import DB as db
from modules.utils.generals import creation_date, encode_password
from modules.utils.token import Token
from typing import Any, Dict, List, Optional

class User_lite:
    """Initialize a lite user's version."""    
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Initialize a lite user's version.

        Args:
            data (Optional[Dict[str, Any]], optional): The user lite data. Defaults to None.
            - _id (ObjectId): The user's ID.
            - username (str): The user's username.

        Raises:
            ValueError: If the data types don't match.
        """        
        try:
            self.valid: bool = True
            #if not data:
            if not data or any(field is None for field in [data.get("_id") or data.get("ID"), data.get("username")]):
                self.valid = False
                self.ID: Optional[ObjectId] = None
                self.username: Optional[str] = None

            else:
                self.ID = ObjectId(data.get("_id", data.get("ID")))
                if not self.ID:
                    raise Exception("No hay ID")
                self.username = str(data["username"])
            
        except Exception as e:
            raise ValueError(f"Error initializing the User_lite: {e}.")

    def __bool__(self) -> bool:
        """
        The validity of the user.

        Returns:
            bool: True if is valid, else False.
        """       
        return self.valid

    def __eq__(self, other: object) -> bool:
        """
        Compare two objects and give if they are the same

        Args:
            other (object): Other User to compare.

        Returns:
            bool: True if is the same, else False.
        """        
        if not isinstance(other, (User, User_lite)):
            return False
        
        return self.ID == other.ID
    
    def json(self) -> Dict[str, Any]:
        """
        Parse the user to JSON format.

        Returns:
            Dict[str, Any]: User data in JSON.
        """    
        if not self:
            raise ValueError("Error parsing the user: User not valid.")
        
        try:
            return {
                "ID": self.ID,
                "username": self.username
            }
        
        except Exception as e:
            raise ValueError(f"Error parsing the user: {e}")
        
    def token(self) -> str:
        """
        Creates a JWT with the user data.

        Raises:
            RuntimeError: Error creating the token.

        Returns:
            str: The JWT created.
        """        
        if not self:
            raise ValueError("Error creating the token: User not valid.")

        try:
            return Token.encode(self.ID, self.username)

        except Exception as e:
            raise RuntimeError(f"Error creating the token: {e}") from e


class User(User_lite):
    """Initialize an user."""    
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        """
        Initialize an user.

        Args:
            data (Optional[Dict[str, Any]], optional): The user data. Defaults to None.
                - _id (ObjectId, optional): The User ID, if isn't given create a new ID.
                - username (str): User's username.
                - email (str): User's email.
                - password (str): User's password.
                - posts (List[ObjectId], optional): User'posts.
                - followers (List[ObjectId], optional): User's followers.
                - following (List[ObjectId], optional): User's following.
                - likes (List[ObjectId], optional): User's likes.
                - createdAt (str, optional): Creation date, if isn't given create a new one.
        
        Raises:
            ValueError: If the data types don't match.
        """        
        try:
            self.valid: bool = True
            #if nor data or any(field is None for field in [data.get("username"), data.get("email"), data.get("password")])
            if not data:
                self.valid = False

            else:            
                self.ID: ObjectId = ObjectId(data.get("_id", ObjectId()))
                self.username: str = str(data["username"])
                self.email: str = str(data["email"])
                self.password: str = str(data["password"])
                self.posts: List[ObjectId] = data.get("posts", [])
                self.followers: List[ObjectId] = data.get("followers", [])
                self.following: List[ObjectId] = data.get("following", [])
                self.likes: List[ObjectId] = data.get("likes", [])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error initializing the User: {e}.")

    def json(self) -> Dict[str, Any]:
        """
        Parse the user to JSON format.

        Returns:
            Dict[str, Any]: User data in JSON.
        """  
        try:
            if not self:
                raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
            
            return {
                "_id": self.ID,
                "username": self.username,
                "email": self.email,
                "password": self.password,
                "posts": self.posts,
                "followers": self.followers,
                "following": self.following,
                "likes": self.likes,
                "createdAt": self.createdAt
            }
        
        except Exception as e:
            raise RuntimeError(f"Error parsing the user: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        """
        Filter a user with this params:
        - Returns the "username".
        - Returns the posts.
        - Returns the count of followers.
        - Returns "isFollowing" as True of False, if is self don't have this key.

        Args:
            request_user (User_lite, optional): The user that fetch the post. Defaults to User_lite().

        Raises:
            RuntimeError: Error filtering the user.

        Returns:
            Dict[str, Any]: The user filtered.
        """    

        from modules.posts import Posts
        try:
            if not self:
                raise ValueError(f"Error parsing the user: No data was provided")
            
            returned_user: Dict[str, Any] = {
                "username": self.username,
                "posts": Posts.get_user_posts(self.posts),
                "followers": len(self.followers),
                "likes": Posts.get_user_posts(self.likes)
            }
            
            following: bool | None = None if request_user == self else request_user.ID in self.followers

            if following is not None:
                returned_user["isFollowing"] = following

            return returned_user

        except Exception as e:
            raise RuntimeError(f"Error filtering the user: {e}")

    def lite(self) -> User_lite:
        """
        Make a lite user's version.

        Raises:
            RuntimeError: Error liting de user.

        Returns:
            User_lite: The lite user's version.
        """        
        try:
            if not self:
                raise ValueError(f"Error parsing the user: No data was provided")
            
            return User_lite({
                "ID": self.ID,
                "username": self.username
            })
        
        except Exception as e:
            raise RuntimeError(f"Error liting the user: {e}")


class Users:
    """Manage all users in the app."""
    @classmethod
    def get_user(self, value: Any, field: str = "_id") -> User:
        """
        Fetch a user.

        Args:
            value (Any): The value of the field to search.
            field (str, optional): The field to search. Defaults to "_id".

        Raises:
            RuntimeError: Error fetching the user.

        Returns:
            Dict[str, Any]: The user.
        """       
        try:      
            user: Dict[str, Any] = db.get_user(value, field)
            return User(user)

        except Exception as e:
            raise RuntimeError(f"Error fetching the user: {e}") from e
        
    @classmethod
    def create_user(self, username: str, email: str, password: str) -> User:
        """
        Creates a new user.

        Args:
            username (str): The username.
            email (str): The email.
            password (str): The password

        Raises:
            RuntimeError: Error creating the user.

        Returns:
            User: The new user if was created.
        """        
        try:
            new_user: User = User({
                "username": username,
                "email": email,
                "password": encode_password(password)
            })
            return new_user if db.add_user(new_user.json()) else User()
        
        except Exception as e:
            raise RuntimeError(f"Error creating the user: {e}") from e
        
    @classmethod
    def follow(self, follower: User_lite, following: User_lite) -> bool:
        """
        Make a follow.

        Args:
            follower (User_lite): User that wants to follow.
            following (User_lite): User that will be followed.

        Raises:
            RuntimeError: Error following.

        Returns:
            bool: True if the operation was successfull.
        """
        try:
            return db.follow(follower.ID, following.ID)
        
        except Exception as e:
            raise RuntimeError(f"Error following the user: {e}") from e
        
    @classmethod
    def unfollow(self, follower: User_lite, following: User_lite) -> bool:
        """
        Make a unfollow.

        Args:
            follower (User_lite): User that wants to unfollow.
            following (User_lite): User that will be unfollowed.

        Raises:
            RuntimeError: Error unfollowing.

        Returns:
            bool: True if the operation was successfull.
        """
        try:
            return db.unfollow(follower.ID, following.ID)
        
        except Exception as e:
            raise RuntimeError(f"Error unfollowing the user: {e}") from e