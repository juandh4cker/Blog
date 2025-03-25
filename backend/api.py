from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from functools import wraps
from app import app

#Organizar rutas y hacer archivo para claves/rutas/configuraciones
#Lenguaje para haces peticiones (graphql)

api = Flask(__name__)
CORS(api)

#Methods

def returny(to_return):
    returned = to_return
    code = 500

    if type(to_return) != dict:
        return to_return

    if to_return.get("info"):
        code = 200
    
    elif to_return.get("created"):
        code = 201
    
    else: 
        error = to_return.get("error", "error")
        match error:
            case "Credenciales inválidas":
                code = 400
            
            case "Datos inválidos":
                code = 400
            
            case "No autorizado":
                code = 401
            
            case "No encontrado":
                code = 404
            
            case "Ya en uso":
                code = 409
            
            case _:
                code = 500
            
    return jsonify(returned), code

# JWT

def set_token(username, token, code):
    response = make_response(returny({code: username}))
    response.set_cookie(
        "token", token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=86400    # Expira en 1 dia
    )
    return response

def verify_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.cookies.get("token", None)
        if not token:
            return returny({"error": "No autorizado"})

        result = app.verify_token(token)
        
        if result["verify"] is False:
            return returny({"error": "No autorizado"})

        request.user = result["user"]
        return f(*args, **kwargs)

    return wrapper

@api.route("/api/app/verify", methods=["GET"])
def verify_token_request():
    token = request.cookies.get("token", None)

    if token:
        result = app.verify_token(token)
        verify = result["verify"]
        
        if verify:
            return returny({"info": verify})
    return returny({"error": "No autorizado"})

#Access

@api.route("/api/app/login", methods=["POST"])
def login():
    data = request.get_json()
    email_or_username = data.get("email_or_username")
    password = data.get("password")

    if not email_or_username or not password:
        return returny({"error": "Credenciales inválidas"})
    
    result = app.login(email_or_username, password)
    if result.get("info"):
        result = result.get("info")
        return set_token(result["username"], result["token"], "info")
    
    return returny(result)

@api.route("/api/app/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return returny({"error": "Credenciales inválidas"})
    
    result = app.register(username, email, password)
    if result.get("created"):
        result = result.get("created")
        return set_token(result["username"], result["token"], "created")
    
    return returny(result)

# Users

@api.route("/api/user/<string:username>", methods=["GET"])
@verify_token
def get_user(username):
    return returny(app.get_user(username.capitalize(), request.user))

@api.route("/api/user/<string:username>/follownt", methods=["PUT"])
@verify_token
def follow_user(username):
    username = username.capitalize()
    if request.user["username"] == username:
        return returny({"error": "You can't follow yourself"})
    
    return returny(app.follownt(username, request.user))

#Posts

@api.route("/api/posts", methods=["GET"])
def get_posts():
    token = request.headers.get("Authorization")

    if token:
        return returny(app.get_posts(request.user if app.verify_token["verify"] else {}))

    return returny(app.get_posts())

@api.route("/api/post/<int:post_id>", methods=["GET"])
@verify_token
def get_post(post_id):
    return returny(app.get_post(post_id, request.user))

@api.route("/api/post/create", methods=["POST"])
@verify_token
def create_post():
    new_post = request.get_json()
    name = new_post.get("name")
    location = new_post.get("location")
    review = new_post.get("review")
    rating = new_post.get("rating")
    imageUrl = new_post.get("imageUrl")

    if not name or not location or not review or not rating or not imageUrl:
        return returny({"error": "Datos inválidos"})
    
    return returny(app.create_post(name, location, review, int(rating), imageUrl, request.user))
    
@api.route("/api/post/<int:post_id>/edit", methods=["PUT"])
@verify_token
def edit_post(post_id):
    new_post = request.get_json()
    name = new_post.get("name", "")
    location = new_post.get("location", "")
    review = new_post.get("review", "")
    rating = new_post.get("rating", 0)
    imageUrl = new_post.get("imageUrl", "")
    return returny(app.edit_post(post_id, name, location, review, rating, imageUrl, request.user))

@api.route("/api/post/<int:post_id>/delete", methods=["DELETE"])
@verify_token
def delete_post(post_id):
    return returny(app.delete_post(post_id, request.user))

#Comments

@api.route("/api/post/<int:post_id>/comment", methods=["PUT"])
@verify_token
def new_comment(post_id):
    new_comment = request.get_json()
    content = new_comment.get("name")
    rating = new_comment.get("rating")

    if not content or not rating:
        return returny({"error": "Datos inválidos"})

    return returny(app.new_comment(post_id, content, rating, request.user))

@api.route("/api/post/<int:post_id>/comment/<int:comment_id>/delete", methods=["DELETE"])
@verify_token
def delete_comment(post_id, comment_id):
    return returny(app.delete_comment(post_id, comment_id, request.user))


if __name__ == "__main__":
    api.run(debug=True)