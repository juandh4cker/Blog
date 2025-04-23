from app import App
from modules.utils.token import Token
from flask import Flask, jsonify, make_response, request, Response
from flask_cors import CORS
from functools import wraps
from modules.utils.exceptions import *
from typing import Any, List, Dict, Tuple

#Organizar rutas y hacer archivo para claves/rutas/configuraciones
#Lenguaje para haces peticiones (graphql)
#Que el token se envíe siempre

api: Flask = Flask(__name__)
CORS(api, supports_credentials=True)

#Methods
@api.route("/api/app/logout", methods=["POST"])
def logout():
    response = make_response({"data": "Sesión cerrada"})
    response.set_cookie('token', '', expires=0, path='/', samesite='Lax', secure=False)
    return response

def returny(to_return: Any, code = 200) -> Tuple[Response, Any]:
    tipo: str = "data"
    if code >= 400:
        tipo = "error"
    return jsonify({tipo: to_return}), code

def set_token(token: Dict[str, Any], code: int = 200) -> Response:
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
    @wraps(f)
    def wrapper(*args, **kwargs):
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
    token: str = request.cookies.get("token") or ""

    if token:
        result: Dict[str, Any] = App.verify_token(token)
        verify: bool = result["verify"]
        
        if verify:
            return returny(True)
        
    return returny(False)

#Access

@api.route("/api/app/login", methods=["POST"])
def login() -> Response | Tuple[Response, Any]:
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
    try:
        user: Dict[str, Any] = App.get_user(username.capitalize(), request.user)  # type: ignore
        return returny(user)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/user/<string:username>/follownt", methods=["PUT"])
@verify_token
def follow_user(username: str) -> Tuple[Response, Any]:
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
    try:
        result: Dict[str, Any] = App.get_post(post_id, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

@api.route("/api/post/create", methods=["POST"])
@verify_token
def create_post() -> Tuple[Response, Any]:
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
    try:
        result: bool = App.delete_post(post_id, request.user)  # type: ignore
        return returny(result)
    
    except Exception as e:
        return excepty(e)

#Comments

@api.route("/api/post/<string:post_id>/comment", methods=["PUT"])
@verify_token
def new_comment(post_id: str) -> Tuple[Response, Any]:
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
    try:
        result: bool = App.delete_comment(post_id, comment_id, request.user)  # type: ignore
        return returny(result)

    except Exception as e:
        return excepty(e)

if __name__ == "__main__":
    api.run(debug=True)