from bson import ObjectId
from modules.database import DB as db
from modules.utils.generals import creation_date, encode_password
from modules.utils.token import Token
from typing import Any, Dict, List, Optional

class User_lite:
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
        try:
            self.valid: bool = True
            #if not data:
            if not data or any(field is None for field in [data.get("_id") or data.get("ID"), data.get("username")]):
                self.valid = False
                self.ID: Optional[ObjectId] = None
                self.username: Optional[str] = None

            else:
                self.ID = ObjectId(data.get("ID", data.get("_id")))
                if not self.ID:
                    raise Exception("No hay ID")
                self.username = str(data["username"])
            
        except Exception as e:
            raise ValueError(f"Error al inicializar User_lite: {e}.")

    def __bool__(self) -> bool:
        return self.valid

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, (User, User_lite)):
            return False
        
        return self.ID == other.ID
    
    def json(self) -> Dict[str, Any]:
        if not self:
            raise ValueError("Error al parsear el user: El usuario no es válido.")
        
        try:
            return {
                "ID": self.ID,
                "username": self.username
            }
        
        except Exception as e:
            raise ValueError(f"Error al parsear el User: {e}")
        
    def token(self) -> str:
        if not self:
            raise ValueError("Error al crear el token: El usuario no es válido.")

        try:
            return Token.encode(self.ID, self.username)

        except Exception as e:
            raise RuntimeError(f"Error al crear el token: {e}") from e


class User(User_lite):
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
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
                self.posts: List[int] = data.get("posts", [])
                self.followers: List[int] = data.get("followers", [])#objectid
                self.following: List[int] = data.get("following", [])
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error al inicializar User: {e}.")

    def json(self) -> Dict[str, Any]:
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
                "createdAt": self.createdAt
            }
        
        except Exception as e:
            raise ValueError(f"Error al parsear el User: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        from modules.posts import Posts
        try:
            if not self:
                raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
            
            returned_user: Dict[str, Any] = {
                "username": self.username,
                "posts": Posts.get_user_posts(self.posts),
                "followers": len(self.followers),
            }
            
            following: bool | None = None if request_user == self else request_user.ID in self.followers

            if following is not None:
                returned_user["isFollowing"] = following

            return returned_user

        except Exception as e:
            raise ValueError(f"Error al filtrar el usuario: {e}")

    def lite(self) -> User_lite:
        try:
            if not self:
                raise ValueError(f"Error al parsear el User: No se proporcionaron datos")
            
            return User_lite({
                "ID": self.ID,
                "username": self.username
            })
        
        except Exception as e:
            raise ValueError(f"Error al litear el usuario: {e}")


class Users:
    @classmethod
    def get_user(self, value: Any, field: str = "_id") -> User:
        try:      
            user: Dict[str, Any] = db.get_user(value, field)
            return User(user)

        except Exception as e:
            raise ValueError(f"Error al obtener el usuario: {e}") from e
        
    @classmethod
    def create_user(self, username: str, email: str, password: str) -> User:
        try:
            new_user: User = User({
                "username": username,
                "email": email,
                "password": encode_password(password)
            })
            return new_user if db.add_user(new_user.json()) else User()
        
        except Exception as e:
            raise ValueError(f"Error al crear el usuario: {e}") from e
        
    @classmethod
    def follow(self, follower: User_lite, following: User_lite) -> bool:
        try:
            return db.follow(follower.ID, following.ID)
        
        except Exception as e:
            raise ValueError(f"Error al seguir (o no) el usuario: {e}") from e
        
    @classmethod
    def unfollow(self, follower: User_lite, following: User_lite) -> bool:
        try:
            return db.unfollow(follower.ID, following.ID)
        
        except Exception as e:
            raise ValueError(f"Error al eliminar el usuario: {e}") from e