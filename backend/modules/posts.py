from bson import ObjectId
from modules.database import DB as db
from modules.utils.generals import creation_date
from modules.users import User_lite
from typing import Any, Dict, List, Set, Optional

class Comment:
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
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
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error al inicializar Comment: {e}")
    
    def __bool__(self) -> bool:
        return self.valid

    def json(self) -> Dict[str, Any]:
        try:
            if not self:
                raise ValueError(f"Error al parsear el Comentario: No se proporcionaron datos")
            
            return {
                "_id": self.ID,
                "content": self.content,
                "rating": self.rating,
                "creator": self.creator.json(),
                "createdAt": self.createdAt
            }
        
        except Exception as e:
                raise ValueError(f"Error al parsear el comentario: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        try:
            returned_comment: Dict[str, Any] = self.json()
            returned_comment["ID"] = str(returned_comment.pop("_id"))
            returned_comment["creator"] = self.creator.username
            returned_comment["editable"] = True if request_user == self.creator else False
            return returned_comment

        except Exception as e:
                raise ValueError(f"Error al filtrar el comentario: {e}")


class Post:
    def __init__(self, data: Optional[Dict[str, Any]] = None) -> None:
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
                self.createdAt: str = str(data.get("createdAt", creation_date()))
        
        except Exception as e:
            raise ValueError(f"Error al inicializar Post: {e}")

    def __bool__(self) -> bool:
        return self.valid

    def json(self) -> Dict[str, Any]:
        try:
            if not self:
                raise ValueError(f"Error al parsear el Post: No se proporcionaron datos")
            
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
            raise ValueError(f"Error al parsear el Post: {e}")

    def filter(self, request_user: User_lite = User_lite()) -> Dict[str, Any]:
        try:
            returned_post: Dict[str, Any]  = self.json()
            returned_post["ID"] = str(returned_post.pop("_id"))
            returned_post["creator"] = self.creator.username
            returned_post["editable"] = request_user == self.creator
            returned_post["comments"] = [Comment(comment).filter(request_user) for comment in returned_post["comments"]]
            return returned_post

        except Exception as e:
            return {str(e)}

    def edit(self, new_info: Dict[str, Any] = {}) -> Dict[str, Any]:
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
            raise ValueError(f"Error al editar el Post: {e}")

    def lite(self) -> Dict[str, Any]:
        if not self:
            raise ValueError(f"Error al litear el Post: No se proporcionaron datos")
        
        try:
            return {
                "ID": str(self.ID),
                "name": self.name,
                "location": self.location,
                "rating": self.rating,
                "imageUrl": self.imageUrl
            }
        except Exception as e:
            raise ValueError(f"Error al litear el post: {e}") from e


class Posts:
    @classmethod
    def get_posts(cls) -> List[Dict[str, Any]]:
        try:
            posts: List[Dict[str, Any]] = db.get_posts()
            return posts
        
        except Exception as e:
            raise ValueError(f"Error al obtener posts: {e}") from e

    @classmethod
    def get_user_posts(cls, user_posts: list = []) -> List[Dict[str, Any]]:
        try:
            posts: List[Dict[str, Any]] = []

            for post_id in user_posts:
                lite: Dict[str, Any] = cls.get_post(post_id).lite()
                posts.append(lite)
                
            return posts
        
        except Exception as e:
            raise ValueError(f"Error al obtener los posts del usuario: {e}") from e

    @classmethod
    def get_post(cls, value: Any, field: str = "_id") -> Post:
        try:
            post: Dict[str, Any] = db.get_post(value, field)
            return Post(post)
        
        except Exception as e:
            raise ValueError(f"Error al obtener el post: {e}") from e

    @classmethod
    def create_post(cls, name: str, location: str, review: str, rating: float, imageUrl: str, creator: User_lite) -> Post:
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
            raise ValueError(f"Error al crear el post: {e}") from e
                
    @classmethod
    def edit_post(cls, post: Post, new_data: Dict[str, Any] = {}) -> Post:
        try:
            edited: Dict[str, Any] = post.edit(new_data)
            if edited:
                return post if db.edit_post(post.ID, edited) else Post()
            return Post()

        except Exception as e:
            raise ValueError(f"Error al editar el post: {e}") from e
    
    @classmethod
    def delete_post(cls, post: Post) -> Post:
        try:
            return post if db.delete_post(post.ID, post.creator.ID) else Post()
        
        except Exception as e:
            raise ValueError(f"Error al borrar el post: {e}") from e
    
    #Comments

    @classmethod
    def __get_comments(cls, post: Post, request_user: User_lite = User_lite()) -> List[Dict[str, Any]]:
        try:
            db_comments: List[Dict[str, Any]] = db._get_comments(post.ID)
            comments: List[Dict[str, Any]] = []
            for comment in db_comments:
                comments.append(Comment(comment).filter(request_user))
            
            return comments
        
        except Exception as e:
            raise ValueError(f"Error al obtener comentarios: {e}") from e    

    @classmethod
    def get_comment(cls, post_id: ObjectId, comment_id: ObjectId) -> Comment:
        try:
            comment: Dict[str, Any]  = db.get_comment(post_id, comment_id)
            return Comment(comment)
        
        except Exception as e:
            raise ValueError(f"Error al obtener el comentario: {e}") from e

    @classmethod
    def new_comment(cls, post: Post, content: str, rating: float, creator: User_lite) -> Comment:
        try:
            new_comment: Comment = Comment({
                "content": content,
                "rating": rating,
                "creator": creator.json()
            })
            return new_comment if db.add_comment(post.ID, new_comment.json()) else Comment()
        
        except Exception as e:
            raise ValueError(f"Error al crear el comentario: {e}") from e
    
    @classmethod
    def delete_comment(cls, post: Post, comment: Comment) -> Comment:
        try: 
            return comment if db.delete_comment(post.ID, comment.ID) else Comment()
        
        except Exception as e:
            raise ValueError(f"Error al eliminar el comentario: {e}") from e