from modules.posts import Comment, Post, Posts
from modules.users import User, Users, User_lite
from modules.utils.exceptions import *
from modules.utils.generals import check_password, logify, is_valid_username, is_valid_email, is_valid_password, is_valid_image
from modules.utils.log import Log
from modules.utils.token import Token
from typing import Any, Dict, List

class App:
    """Manages al the app functions."""    
    Log.info("Application initialized.")
    
    #Access

    @staticmethod
    def login(username_or_email: str, password: str) -> Dict[str, Any]:
        """
        Log an user into the app.

        Args:
            username_or_email (str): User's username or email.
            password (str): User's password.

        Raises:
            InvalidCredential: If username or email aren't valid.
            InvalidCredential: If password isn't valid.
            IncorrectCredential: If password doesn't match.
            NotFound: If the user no exist.
            GeneralError: General errors.

        Returns:
            Dict[str, Any]: The username and the token in a dict: {"username": username, "token": token}.
        """
        try:
            if not username_or_email or (not is_valid_username(username_or_email) and not is_valid_email(username_or_email)):
                raise InvalidCredential("Username or email")

            if not password or not is_valid_password(password):
                raise InvalidCredential("Password")
            
            user: User = Users.get_user(username_or_email.lower(), "email") if "@" in username_or_email else Users.get_user(username_or_email.capitalize(), "username")

            if user:
                if check_password(password, user.password):
                    Log.info(f"User {user.ID} logged in")
                    return {"username": user.username, "token": user.token()}
                raise IncorrectCredential(user.ID)

            else:
                raise NotFound("user")
        
        except Exception as e:
            raise GeneralError(
                data="Error logging the user",  
                error=e, 
                log=logify(["password"])
            ) from e
    
    @staticmethod
    def register(username: str, email: str, password: str) -> Dict[str, Any]: 
        """
        Register a user into the app.

        Args:
            username (str): The new's user username.
            email (str): The new's user email.
            password (str): The new's user password.

        Raises:
            InvalidCredential: If username isn't valid.
            InvalidCredential: If email isn't valid.
            InvalidCredential: If password isn't valid.
            AlreadyInUse: If username is already in use by another user.
            AlreadyInUse: If email is already in use by another user.
            GeneralError: General errors.

        Returns:
            Dict[str, Any]: The username and the token in a dict: {"username": username, "token": token}.
        """        
        try:
            if not username or not is_valid_username(username):
                raise InvalidCredential("username")
            
            if not email or not is_valid_email(email):
                raise InvalidCredential("email")
            
            if not password or not is_valid_password(password):
                raise InvalidCredential("password")
            
            username = username.capitalize()
            email = email.lower()

            if Users.get_user(username, "username"):
                raise AlreadyInUse("username")
            
            if Users.get_user(email, "email"):
                raise AlreadyInUse("email")

            user: User = Users.create_user(username, email, password)

            if user:
                Log.info(f"User {user.ID} created and logged in")
                return {"username": user.username, "token": user.token()}

            raise GeneralError("Error creating the user")
        
        except Exception as e:
            raise GeneralError(
                data=f"Error creating the user", 
                error=e, 
                log=logify(["password"])
            ) from e
    
    #Users

    @staticmethod
    def get_user(username: str, request_user: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fetch an user.

        Args:
            username (str): The user's username to fetch.
            request_user (Dict[str, Any]): The user that makes the request.

        Raises:
            NotFound: If the user isn't found.
            GeneralError: General errors.

        Returns:
            Dict[str, Any]: The fetched user data.
        """        
        try:
            request_User: User_lite = User_lite(request_user)
            user: User = Users.get_user(username.capitalize(), "username")

            if user:
                Log.info(f"User {user.ID} fetched by User {request_User.ID}")
                return user.filter(request_User)
            raise NotFound("user")
        
        except Exception as e:
            raise GeneralError(
                data=f"Error fetching the user {username}", 
                error=e
            ) from e
    
    #Follows

    @staticmethod
    def follownt(following_username: str, request_user: Dict[str, Any]) -> bool:
        """
        Follows or unfollows an user.

        Args:
            following_username (str): User's username that will be followed or unfollowed.
            request_user (Dict[str, Any]): User that makes the request.

        Raises:
            GeneralError: General errors.
            NotFound: If user isn't found.

        Returns:
            bool: True if the operation was sucessfull.
        """        
        try:
            follower: User_lite = User_lite(request_user)
            following: User = Users.get_user(following_username, "username")
            
            if follower == following:
                raise GeneralError("No puedes seguirte a ti mismo")

            if following:
                if follower.ID not in following.followers:
                    if Users.follow(follower, following):
                        Log.info(f"User {following.ID} followed by {follower.ID}")
                        return True
                    
                    raise GeneralError(
                        data="Error al seguir al usuario", 
                        log=f"{follower.ID} to {following.ID}"
                    )

                else:
                    if Users.unfollow(follower, following):
                        Log.info(f"User {following.ID} unfollowed by {follower.ID}")
                        return True
                    
                    raise GeneralError(
                        data="Error al dejar de seguir al usuario", 
                        log=f"{follower.ID} to {following.ID}"
                    )
            
            raise NotFound("user")
        
        except Exception as e:
            raise GeneralError(
                data="Error al seguir o no", 
                error=e, 
                log=f"{following.ID} follownt by {follower.ID}"
            ) from e
    
    # Saves

    @staticmethod
    def likent(post_id: str, request_user: Dict[str, Any]) -> bool:      
        try:
            user: User_lite = User_lite(request_user)
            post: Post = Posts.get_post(post_id)
            
            if post:
                if user.ID not in post.likes:
                    if Posts.like(user, post):
                        Log.info(f"Post {post.ID} liked by {user.ID}")
                        return True
                    
                    raise GeneralError(
                        data="Error al guardar el post", 
                        log=f"{post.ID} to {user.ID}"
                    )

                else:
                    if Posts.unlike(user, post):
                        Log.info(f"User {post.ID} unliked by {user.ID}")
                        return True
                    
                    raise GeneralError(
                        data="Error al dejar de likear al post", 
                        log=f"{post.ID} to {user.ID}"
                    )
            
            raise NotFound("post")
        
        except Exception as e:
            raise GeneralError(
                data="Error al likear o no", 
                error=e, 
                log=f"{post.ID} likent by {user.ID}"
            ) from e

            
    #Posts

    @staticmethod
    def get_posts(request_user: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Fetch all posts.

        Args:
            request_user (Dict[str, Any]): User that makes the request.

        Raises:
            GeneralError: General errors.

        Returns:
            List[Dict[str, Any]]: All posts.
        """        
        try:
            request_User: User_lite = User_lite(request_user)
            Log.info(f"All posts fetched by {request_User.ID if request_User else 'invited'}")
            return Posts.get_posts()
        
        except Exception as e:
            raise GeneralError(
                data="Error al obtener los posts", 
                error=e
            ) from e

    @staticmethod
    def get_post(post_id: str, request_user: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fetch an specific post,

        Args:
            post_id (str): The post's ID.
            request_user (Dict[str, Any]): The user that makes the request.

        Raises:
            NotFound: If post isn´t found.
            GeneralError: General errors.

        Returns:
            Dict[str, Any]: The post data.
        """        
        try:
            request_User: User_lite = User_lite(request_user)
            try:
                object_id_post = ObjectId(post_id)
            
            except:
                raise NotFound("post")
            
            post: Post = Posts.get_post(object_id_post)
            
            if post:
                Log.info(f"Post {post.ID} fetched by {request_User.ID}")
                return post.filter(request_User)
            
            raise NotFound("post")
        
        except Exception as e:
            raise GeneralError(
                data=f"Error al obtener post {post_id}", 
                error=e
            ) from e
    
    @staticmethod
    def create_post(name: str, location: str, review: str, rating: float, imageUrl: str, creator: Dict[str, Any]) -> str:
        """
        Creates a new post.

        Args:
            name (str): The new post's name.
            location (str): The new post's location.
            review (str): The new post's review.
            rating (float): The new post's rating.
            imageUrl (str): The new post's imageUrl.
            creator (Dict[str, Any]): The new post's creator.

        Raises:
            ValueError: If the rating isn't valid.
            ValueError: If the imange isn't valid.
            GeneralError: General errors.

        Returns:
            str: The created post's ID.
        """        
        try:
            if rating < 0 or rating > 10:
                raise ValueError("Rating inválido")

            if not is_valid_image(imageUrl):
                raise ValueError("Imagen inválida")

            request_User: User_lite = User_lite(creator)
            post: Post = Posts.create_post(name.capitalize(), location.title(), review.capitalize(), rating, imageUrl, request_User)
            
            if post:
                Log.info(f"Post {post.ID} created")
                return str(post.ID)
            
            Log.error(f"Error creating the post {post.json()}")
            raise GeneralError("Error al crear el post")
        
        except Exception as e:
            raise GeneralError(
                data="Error al crear el post", 
                error=e,
                log=f"name: {name}, location: {location}, review: {review}, rating: {rating}, imageUrl: {imageUrl}, creator: {creator}"
                ) from e
    
    @staticmethod
    def edit_post(post_id: str, name: str, location: str, review: str, rating: float, imageUrl: str, request_user: Dict[str, Any]) -> bool:
        """
        Edit a post.

        Args:
            post_id (str): Edited post's ID.
            name (str): Edited post's name.
            location (str): Edited post's location.
            review (str): Edited post's review.
            rating (float): Edited post's rating.
            imageUrl (str): Edited post's imageUrl.
            request_user (Dict[str, Any]): User that makes the request..

        Raises:
            ValueError: If the rating isn't valid.
            ValueError: If the imange isn't valid.
            Unauthorized: If the request user isn't is authorized to edit.
            NotFound: If post isn't founded.
            GeneralError: General error.

        Returns:
            bool: True id was edited.
        """        
        try:
            request_User: User_lite = User_lite(request_user)
            post: Post = Posts.get_post(post_id)

            new_data: Dict[str, Any] = {}
            if name:
                new_data["name"] = name
            
            if location: 
                new_data["location"] = location

            if review: 
                new_data["review"] = review

            if rating and rating != 0: 
                rating = int(rating)
                if rating < 0 or rating > 10:
                    raise ValueError("Rating inválido")
                new_data["rating"] = rating

            if imageUrl: 
                if not is_valid_image(imageUrl):
                    raise ValueError("Imagen inválida")
                new_data["imageUrl"] = imageUrl

            if not new_data:
                return True

            if post:
                if request_User != post.creator:
                    raise Unauthorized()
                
                edited: Post = Posts.edit_post(post, new_data)
                if edited:
                    Log.info(f"Post {post.ID} edited {{original: {post.filter()}, edit: {edited.filter()}}}")
                    return True
                
                Log.error(f"Error editing the post {post_id}, new_data: {new_data}")
                raise GeneralError("Error al editar el Post")

            raise NotFound("post")
             
        except Exception as e:
            raise GeneralError(
                data="Error al editar el post", 
                error=e
                ) from e
    
    @staticmethod
    def delete_post(post_id: str, request_user: Dict[str, Any]) -> bool:
        """
        Delete a post.

        Args:
            post_id (str): Post's ID.
            request_user (Dict[str, Any]): User that makes the request.

        Raises:
            Unauthorized: If the request user isn't is authorized to delete.
            GeneralError: General errors.
            NotFound: If post isn't founded.

        Returns:
            bool: True if was deleted.
        """        
        try:
            request_User: User_lite = User_lite(request_user)
            post: Post = Posts.get_post(post_id)

            if post:
                if request_User != post.creator:
                    raise Unauthorized()
                
                deleted: Post = Posts.delete_post(post)

                if deleted:
                    Log.info(f"Post {post.ID} deleted {{original: {post.json()}}}")
                    return True
            
                Log.error(f"Error deleting post {post.filter()}")
                raise GeneralError("Error al borrar el post")
            
            raise NotFound("post")
         
        except Exception as e:
            raise GeneralError(
                data="Error al borrar el post", 
                error=e
            ) from e
    
    #Comments

    @staticmethod
    def new_comment(post_id: str, content: str, rating:int, request_user: Dict[str, Any]) -> bool:
        """
        Makes a new comment.

        Args:
            post_id (str): Post's ID.
            content (str): Comment content.
            rating (int): Comment rating.
            request_user (Dict[str, Any]): User that makes the request.

        Raises:
            ValueError: If the comment rating isn't valid.
            NotFound: If post isn't found.
            GeneralError: General errors.

        Returns:
            bool: True if the comment was added.
        """        
        try:
            if rating < 0 or rating > 10:
                raise ValueError("Rating inválido")
            
            post: Post = Posts.get_post(post_id)

            if post:
                creator: User_lite = User_lite(request_user)
                comment: Comment = Posts.new_comment(post, content, rating, creator)

                if comment:
                    Log.info(f"Comment {comment.ID} created by {creator.ID} in {post_id}")
                    return True
                
                raise GeneralError("Error al crear el comentario")
            
            raise NotFound("post")
        
        except Exception as e:
            raise GeneralError(
                data="Error al crear el comentario", 
                error=e,
                log=f"{{content: {content}, rating: {rating}, post: {post_id}, creator: {request_user}}}"
            ) from e
    
    @staticmethod
    def delete_comment(post_id: str, comment_id: str, request_user: Dict[str, Any]) -> bool:
        """
        Delete a comment.

        Args:
            post_id (str): Post's ID.
            comment_id (str): Comment's ID.
            request_user (Dict[str, Any]): User that makes the request.

        Raises:
            Unauthorized: If the request user isn't is authorized to delete.
            GeneralError: General errors.
            NotFound: If the post isn't found.
            NotFound: If the comment isn't found.

        Returns:
            bool: True if the comment was deleted.
        """        
        try:
            post: Post = Posts.get_post(post_id)

            if post:
                request_User: User_lite = User_lite(request_user)
                comment: Comment = Posts.get_comment(ObjectId(post_id), ObjectId(comment_id))

                if comment:
                    if request_User != comment.creator:
                        raise Unauthorized()
                    deleted: Comment = Posts.delete_comment(post, comment)

                    if deleted:
                        Log.info(f"Comentario eliminado {{original: {comment.filter()}}}")
                        return True
                    
                    Log.info(f"Error al eliminar el comentario {comment.filter()}")
                    raise GeneralError("Error al borrar el comentario")

                raise NotFound("comment")
            
            raise NotFound("post")
        
        except Exception as e:
            raise GeneralError(
                data="Error al borrar el comentario", 
                error=e,
                log=f"post_id: {post_id}, comment_id: {comment_id}, request_user: {request_user}"
            ) from e
    
    #Token

    @staticmethod
    def verify_token(request_token: str) -> Dict[str, Any]:
        """
        Verify a JWT.

        Args:
            request_token (str): The token to verify

        Raises:
            GeneralError: General error

        Returns:
            Dict[str, Any]: {"verify": True, "user": (token info)} or {"verify": False, "error": (error)}
        """        
        try:
            valid: Dict[str, Any] = Token.is_valid(request_token)
            return valid
        
        except Exception as e:
            raise GeneralError(
                data="Error al verificar el token", 
                error=e
            ) from e