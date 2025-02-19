import json
import os
import logging
import bcrypt
import re
import jwt
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "mi_clave_secreta_super_duper_segura"  # ¡Cámbiala por algo seguro!
CORS(app)

LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'api.log')
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, 'jsons/users.json')
BLOGS_FILE = os.path.join(BASE_DIR, 'jsons/blogs.json')

# Data

def load_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_data(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

# JWT

def create_jwt_token(id, username):
    expiration_time = timedelta(days=1)
    payload = {
        "id": id,
        "username": username,
        "exp": datetime.utcnow() + expiration_time
    }
    return jwt.encode(payload, app.config["JWT_SECRET_KEY"], algorithm="HS256")

import jwt
import functools
from flask import request, jsonify

def verify_token(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token requerido"}), 200

        try:
            decoded_token = jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
            request.user = decoded_token
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 200
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 200

        return f(*args, **kwargs)
    return wrapper


@app.route('/api/user/verify', methods=['GET'])
def verify_token_request():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"verify": False, "error": "Token requerido"}), 200

    try:
        decoded_token = jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return jsonify({"verify": True, "message": "Token válido", "user": decoded_token}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"verify": False, "error": "Token expirado"}), 200
    except jwt.InvalidTokenError:
        return jsonify({"verify": False, "error": "Token inválido"}), 200

#Access

@app.route('/api/user/login', methods=['POST'])
def login():
    def is_valid_username(name):
        pattern = r'^[a-zA-Z0-9._]+[a-zA-Z0-9_]$'
        return bool(re.match(pattern, name))

    def is_valid_email(email):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    data = request.get_json()
    email_or_username = data.get('email_or_username')
    password = data.get('password')

    if not email_or_username or not password:
        logging.warning("Usuario o contraseña no proporcionados")  # IP
        return jsonify({"error": "Credenciales inválidas"}), 200

    if not (is_valid_email(email_or_username) or is_valid_username(email_or_username)):
        logging.warning("Usuario o email no válidos")  # IP
        return jsonify({"error": "Credenciales inválidas"}), 200

    users = get_users()
    user = next((user for user in users if user['email'] == email_or_username or user['username'] == email_or_username.capitalize()), None)

    if user:
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            logging.info(f"User {user['id']} logged in successfully")
            token = create_jwt_token(user['id'], user['username'])
            return jsonify({'username': user['username'],'token': token}), 200
        else:
            logging.warning(f"Invalid credentials for User {user['id']}")  # IP
            return jsonify({"error": "Credenciales inválidas"}), 200
    else:
        logging.warning("Invalid credentials")  # IP
        return jsonify({"error": "Credenciales inválidas"}), 200

@app.route('/api/user/register', methods=['POST'])
def register():
    def create_user(user):
        users = load_data(USERS_FILE)
        users.append(user)
        save_data(USERS_FILE, users)
        logging.info(f"User {user['id']} created successfully")

    def is_valid_username(username):
        pattern = r'^[a-zA-Z0-9._]+[a-zA-Z0-9_]$'
        return bool(re.match(pattern, username))

    def is_valid_email(email):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    def is_valid_password(password):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
        return bool(re.match(pattern, password))

    data = request.get_json()
    username = data.get('username').capitalize()
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        logging.warning("Usuario o contraseña no proporcionados")
        return jsonify({"error": "Credenciales inválidas"}), 200
    
    if not (is_valid_username(username) or is_valid_email(email) or is_valid_password(password)):
        logging.warning("Usuario o email no válidos")
        return jsonify({"error": "Credenciales inválidas"}), 200
    
    users = get_users()

    if next((user for user in get_users() if user['username'] == username), None):
        logging.warning(f"Username {username} already exists")
        return jsonify({"error": "Usuario ya existe"}), 200

    if next((user for user in get_users() if user['email'] == email), None):
        logging.warning(f"Email {email} already exists")
        return jsonify({"error": "Email ya existe"}), 200

    user = {
        "createdAt": datetime.utcnow().isoformat(timespec='milliseconds') + "Z",
        "username": username,
        "email": email,
        "password": bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8'),
        "posts": [],
        "followers": [],
        "followedBy": [],
        "following": [],
        "id": str(len(users) + 1)
    }

    create_user(user)
    logging.info(f"User {user['id']} logged in successfully")
    token = create_jwt_token(user['id'], user['username'])
    return jsonify({'username': user['username'], 'token': token}), 200

# Users

def get_users():
    return load_data(USERS_FILE)

@app.route('/api/users/<string:username>', methods=['GET'])
@verify_token
def get_user(username):
    users = load_data(USERS_FILE)
    user = next((user for user in users if user['username'] == str(username).capitalize()), None)

    if user:
        user_filtered = {
            "username": user["username"],
            "posts": user["posts"],
            "followers": len(user.get("followers", [])),
            "following": len(user.get("following", []))
        }
        logging.info(f"User {username} fetched successfully")
        return jsonify(user_filtered), 200
    else:
        logging.warning(f"User {username} not found")
        return jsonify({"message": "User not found"}), 404

#Blogs

@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    blogs = load_data(BLOGS_FILE)
    logging.info("Fetched all blogs")
    return jsonify(blogs), 200

@app.route('/api/blogs/<int:blog_id>', methods=['GET'])
def get_blog_by_id(blog_id):
    try:
        token = request.headers.get("Authorization")
        decoded_token = jwt.decode(token, app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
    except:
        decoded_token = None


    blogs = load_data(BLOGS_FILE)
    blog = next((blog for blog in blogs if blog['id'] == int(blog_id)), None)
    if blog:
        if decoded_token:
            if (decoded_token['username'] == blog['creator']):
                blog['editable'] = True
            else:
                blog['editable'] = False
        else:
            blog['editable'] = False
                
        logging.info(f"Blog {blog_id} fetched successfully")
        return jsonify(blog), 200
    else:
        logging.warning(f"Blog {blog_id} not found")
        return jsonify({"message": "Blog not found"}), 404


@app.route('/api/blogs', methods=['POST'])
@verify_token
def create_blog():
    new_blog = request.get_json()
    blogs = load_data(BLOGS_FILE)
    new_blog['id'] = str(len(blogs) + 1)
    new_blog['createdAt'] = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    new_blog['comments'] = []
    blogs.append(new_blog)

    users = load_data(USERS_FILE)
    user = next((user for user in users if user['id'] == str(request.user['id']).capitalize()), None)
    user['posts'].append(int(new_blog['id']))
    save_data(USERS_FILE, users)

    new_blog['creator'] = user['username']

    save_data(BLOGS_FILE, blogs)
    logging.info(f"Blog {new_blog['id']} created successfully")
    return jsonify(new_blog), 201

#Comments
@app.route('/api/blogs/<int:blog_id>', methods=['PUT'])
@verify_token
def new_comment(blog_id):
    blogs = load_data(BLOGS_FILE)
    blog = next((blog for blog in blogs if blog['id'] == int(blog_id)), None)
    if blog:
        comment = request.get_json()
        comment['id'] = f"{blog_id}{request.user['id']}{len(blog['comments']) + 1}"
        comment['createdAt'] = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
        comment['userName'] = request.user['username']
        comment['userId'] = request.user['id']
        blog['comments'].append(comment)
        blog['rating'] = round(sum(comment['rating'] for comment in blog['comments']) / len(blog['comments']), 2)
        save_data(BLOGS_FILE, blogs)
        logging.info(f"Comment added to blog {blog_id}")
        return jsonify(blog), 200
    else:
        logging.warning(f"Blog {blog_id} not found")
        return jsonify({"message": "Blog not found"}), 404

@app.route('/api/blogs/<int:blog_id>/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(blog_id, comment_id):
    blogs = load_data(BLOGS_FILE)
    blog = next((blog for blog in blogs if blog['id'] == str(blog_id)), None)
    if blog:
        comment = next((comment for comment in blog['comments'] if comment['id'] == str(comment_id)), None)
        if comment:
            blog['comments'].remove(comment)
            blog['rating'] = sum(comment['rating'] for comment in blog['comments']) / len(blog['comments'])
            save_data(BLOGS_FILE, blogs)
            logging.info(f"Comment {comment_id} deleted from blog {blog_id}")
            return jsonify(blog), 200
        else:
            logging.warning(f"Comment {comment_id} not found in blog {blog_id}")
            return jsonify({"message": "Comment not found"}), 404
    else:
        logging.warning(f"Blog {blog_id} not found")
        return jsonify({"message": "Blog not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
