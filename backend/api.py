from app import App
from modules.utils.token import Token
from flask import Flask, jsonify, make_response, request, Response, send_from_directory
from flask_cors import CORS
from functools import wraps
from modules.utils.exceptions import *
from typing import Any, List, Dict, Tuple
import os

api: Flask = Flask(__name__)
CORS(api, supports_credentials=True)

#Methods
@api.route("/api/app/logout", methods=["POST"])
def logout() -> Response:
    """
    Logout a user.

    Returns:
        Response: Delete the token and retuns {"data": "Sesión cerrada"}
    """    
    response = make_response({"data": "Sesión cerrada"})
    response.set_cookie('token', '', expires=0, path='/', samesite='Lax', secure=False)
    return response

def returny(to_return: Any, code = 200) -> Tuple[Response, Any]:
    """
    Make a return witk code

    Args:
        to_return (Any): Data to return.
        code (int, optional): Code to return.. Defaults to 200.

    Returns:
        Tuple[Response, Any]: The data with the code.
    """    
    tipo: str = "data"
    if code >= 400:
        tipo = "error"
    return jsonify({tipo: to_return}), code

def set_token(token: Dict[str, Any], code: int = 200) -> Response:
    """
    Set a safe token.

    Args:
        token (Dict[str, Any]): Token.
        code (int, optional): Code to returns. Defaults to 200.

    Returns:
        Response: Set the token.
    """    
    response: Response = make_response(jsonify({"data": token['username']}), code)
    response.set_cookie(
        "token", token['token'],
        httponly = True,
        secure = True,
        samesite = "Strict",
        max_age = 86400 #1 día
    )
    return response

def excepty(exception: Exception | CustomException) -> Tuple[Response, Any]:
    """
    Manage the exceptions.

    Args:
        exception (Exception | CustomException): Exception ocurred.

    Raises:
        exception: The exception

    Returns:
        Tuple[Response, Any]: The error.
    """    
    try:
        raise exception
    
    except CustomException as e:
        try:
            return returny(e.error, e.code)

        except Exception as f:
            return returny(f"Error desconocido: {e} | {f}", 500)
        
    except Exception as g:
        return returny(f"Error desconocido: {g}", 500)

# JWT

def verify_token(f) -> Response:
    """
    Verify a JWT.

    Args:
        f (_type_): Function

    Raises:
        Unauthorized: Not token
        Unauthorized: Invalid token

    Returns:
        Response: Function response
    """    
    @wraps(f)
    def wrapper(*args, **kwargs):
        """
        Wrap the function.

        Raises:
            Unauthorized: Not token
            Unauthorized: Invalid token

        Returns:
            _type_: Function response.
        """        
        try:
            token: str = request.cookies.get("token") or ""
            if not token:
                raise Unauthorized()

            result: Dict[str, Any] = App.verify_token(token)
            if not result.get("verify"):
                raise Unauthorized()

            user: Dict[str, Any] = result["user"]
            request.user: Dict[str, Any] = user  # type: ignore

            resp: Tuple[Response, Any] = f(*args, **kwargs)

            new_token: str = Token.encode(user["_id"], user["username"])

            if isinstance(resp, tuple):
                response_obj: Response = make_response(*resp)
            else:
                response_obj: Response = make_response(resp)

            response_obj.set_cookie(
                "token",
                new_token,
                httponly=True,
                secure=True,
                samesite="Strict",
                max_age=86400
            )
            return response_obj

        except CustomException as ce:
            return excepty(ce)

        except Exception as e:
            return excepty(e)

    return wrapper

@api.route("/api/app/verify", methods=["GET"])
def verify_token_request() -> Tuple[Response, Any]:
    """
    Verify a token by request.

    Returns:
        Tuple[Response, Any]: Verify info.
    """    
    token: str = request.cookies.get("token") or ""

    if token:
        result: Dict[str, Any] = App.verify_token(token)
        verify: bool = result["verify"]
        
        if verify:
            return returny(result["user"]["username"])
        
        return returny(False)
    return returny(None)

#Access

@api.route("/api/app/login", methods=["POST"])
def login() -> Response | Tuple[Response, Any]:
    """
    Log an user.

    Returns:
        Response | Tuple[Response, Any]: Loggin info.
    """    
    try:
        data: Dict[str, Any] = request.get_json()
        username_or_email: str = data["username_or_email"]
        password: str = data["password"]
        
        result: Dict[str, Any] = App.login(username_or_email, password)
        return set_token(result)
       
    except Exception as e:
        return excepty(e)

@api.route("/api/app/register", methods=["POST"])
def register() -> Response | Tuple[Response, Any]:
    """
    Register an user

    Returns:
        Response | Tuple[Response, Any]: Register info.
    """    
    try:
        data: Dict[str, Any] = request.get_json()
        username: str = data["username"]
        email: str = data["email"]
        password: str = data["password"]

        result: Dict[str, Any] = App.register(username, email, password)
        return set_token(result, 201)
        
    except Exception as e:
        return excepty(e)

# Users

@api.route("/api/user/<string:username>", methods=["GET"])
@verify_token
def get_user(username: str) -> Tuple[Response, Any]:
    """
    Fetch an user.

    Args:
        username (str): User's username to fetch.

    Returns:
        Tuple[Response, Any]: User data.
    """    
    try:
        user: Dict[str, Any] = App.get_user(username.capitalize(), request.user)  # type: ignore
        return returny(user)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/user/<string:username>/follownt", methods=["PUT"])
@verify_token
def follow_user(username: str) -> Tuple[Response, Any]:
    """
    Follow or unfollows an user.

    Args:
        username (str): User's username to follow or unfollow

    Raises:
        Exception: If is himself.

    Returns:
        Tuple[Response, Any]: Follow data.
    """    
    try:
        username = username.capitalize()
        if request.user["username"] == username: # type: ignore
            raise Exception("You can't follow yourself")
        
        result: bool = App.follownt(username, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

#Posts

@api.route("/api/posts", methods=["GET"])
def get_posts() -> Tuple[Response, Any]:
    """
    Fetch all posts.

    Returns:
        Tuple[Response, Any]: Posts data.
    """    
    try:
        token: str = request.cookies.get("token") or ""
        user: Dict[str, Any] = {}

        if token:
            token_result: Dict[str, Any] = App.verify_token(token)
            if token_result.get("verify"):
                user = token_result.get("user") or {}

        result: List[Dict[str, Any]] = App.get_posts(user)
        return returny(result)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/post/<string:post_id>", methods=["GET"])
@verify_token
def get_post(post_id: str) -> Tuple[Response, Any]:
    """
    Fetch a post.

    Args:
        post_id (str): Post's ID to fetch.

    Returns:
        Tuple[Response, Any]: Post data.
    """    
    try:
        result: Dict[str, Any] = App.get_post(post_id, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/post/create", methods=["POST"])
@verify_token
def create_post() -> Tuple[Response, Any]:
    """
    Create a new post.

    Returns:
        Tuple[Response, Any]: Creation data.
    """    
    try:
        data: Dict[str, Any] = request.get_json()
        name: str = data["name"]
        location: str = data["location"]
        review: str = data["review"]
        rating: int = data["rating"]
        imageUrl: str = data["imageUrl"]

        result: int = App.create_post(name, location, review, int(rating), imageUrl, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)
    
@api.route("/api/post/<string:post_id>/edit", methods=["PUT"])
@verify_token
def edit_post(post_id: str) -> Tuple[Response, Any]:
    """
    Edit a post.

    Args:
        post_id (str): Post's ID.

    Returns:
        Tuple[Response, Any]: Edition data.
    """    
    try:
        new_post: Dict[str, Any] = request.get_json()
        name: str = new_post.get("name", "")
        location: str = new_post.get("location", "")
        review: str = new_post.get("review", "")
        rating: int = new_post.get("rating", 0)
        imageUrl: str = new_post.get("imageUrl", "")

        result: bool = App.edit_post(post_id, name, location, review, rating, imageUrl, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/post/<string:post_id>/delete", methods=["DELETE"])
@verify_token
def delete_post(post_id: str) -> Tuple[Response, Any]:
    """
    Delete a post.

    Args:
        post_id (str): Post's ID.

    Returns:
        Tuple[Response, Any]: Deletion data.
    """    
    try:
        result: bool = App.delete_post(post_id, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/post/<string:post_id>/likent", methods=["PUT"])
@verify_token
def like_post(post_id: str) -> Tuple[Response, Any]:
    """
    Like a post.

    Args:
        post_id (str): Post's ID.

    Returns:
        Tuple[Response, Any]: Like data.
    """    
    try:
        result: bool = App.likent(post_id, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)
#Comments

@api.route("/api/post/<string:post_id>/comment", methods=["PUT"])
@verify_token
def new_comment(post_id: str) -> Tuple[Response, Any]:
    """
    Create a new comment.

    Args:
        post_id (str): Post's ID.

    Returns:
        Tuple[Response, Any]: Creation data.
    """    
    try:
        new_comment: Dict[str, Any] = request.get_json()
        content: str = new_comment["content"]
        rating: int = new_comment["rating"]

        result: bool = App.new_comment(post_id, content, rating, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/post/<string:post_id>/comment/<string:comment_id>/delete", methods=["DELETE"])
@verify_token
def delete_comment(post_id: str, comment_id: str) -> Tuple[Response, Any]:
    """
    Delete a comment.

    Args:
        post_id (str): Post's ID.
        comment_id (str): Comment's ID.

    Returns:
        Tuple[Response, Any]: Deletion data.
    """    
    try:
        result: bool = App.delete_comment(post_id, comment_id, request.user)  # type: ignore
        return returny(result)

    except Exception as e:
        return excepty(e)


SPHINX_BUILD_PATH = os.path.join(os.getcwd(), 'docs', '_build', 'html')

@api.route('/api/docs/<path:filename>')
def serve_docs(filename):
    """
    Give the filename.

    Args:
        filename (_type_): Filename.

    Returns:
        _type_: The file.
    """    
    return send_from_directory(SPHINX_BUILD_PATH, filename)

@api.route('/api/docs/')
def serve_docs_index():
    """
    Give the app documentation.

    Returns:
        _type_: index.html
    """    
    return send_from_directory(SPHINX_BUILD_PATH, 'index.html')

if __name__ == "__main__":
    api.run(debug=True)