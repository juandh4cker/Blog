import json
import os
import logging
import bcrypt
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
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

def load_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_data(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/api/users', methods=['GET'])
def get_users():
    return load_data(USERS_FILE)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    users = load_data(USERS_FILE)
    user = next((user for user in users if user['id'] == str(user_id)), None)
    if user:
        logging.info(f"User {user_id} fetched successfully")
        return jsonify(user), 200
    else:
        logging.warning(f"User {user_id} not found")
        return jsonify({"message": "User not found"}), 404

@app.route('/api/login', methods=['GET'])
def login():
    def is_valid_username(name):
        pattern = r'^[a-zA-Z0-9._]+[a-zA-Z0-9_]$'
        return bool(re.match(pattern, name))

    def is_valid_email(email):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    def is_valid_password(password):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
        return bool(re.match(pattern, password)) #Quitar

    email_or_username = request.args.get('email_or_username')
    password = request.args.get('password')

    if not email_or_username or not password:
        logging.warning("Usuario o contraseña no proporcionados") #IP
        return jsonify({"warning": "Credenciales inválidas"}), 200
    
    if not (is_valid_email(email_or_username) or is_valid_username(email_or_username)):
        logging.warning("Usuario o email no válidos")#IP
        return jsonify({"warning": "Credenciales inválidas"}), 200

    users = get_users()
    user = next((user for user in users if user['email'] == email_or_username or user['name'] == email_or_username.capitalize()), None)
    
    if user: 
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            logging.info(f"User {user['id']} logged in successfully")
            return jsonify({'name': user['name'], 'token': 'token'}), 200 #Token
        
        else:
            logging.warning(f"Invalid credentials for User {user['id']}") #IP
            return jsonify({"warning": "Credenciales inválidas"}), 200

    else:
        logging.warning("Invalid credentials") #IP
        return jsonify({"warning": "Credenciales inválidas"}), 200

@app.route('/api/register', methods=['GET'])
def register():
    def create_user(user):
        users = load_data(USERS_FILE)
        users.append(user)
        save_data(USERS_FILE, users)
        logging.info(f"User {user['id']} created successfully")
        return jsonify(user), 201

    def is_valid_username(name):
        pattern = r'^[a-zA-Z0-9._]+[a-zA-Z0-9_]$'
        return bool(re.match(pattern, name))

    def is_valid_email(email):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    def is_valid_password(password):
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
        return bool(re.match(pattern, password))

    users = get_users()
    username = request.args.get('username')
    email = request.args.get('email')
    password = request.args.get('password')

    if not username or not email or not password:
        logging.warning("Usuario o contraseña no proporcionados") #IP
        return jsonify({"warning": "Credenciales inválidas"}), 200
    
    if not (is_valid_username(username) or is_valid_email(email) or is_valid_password(password)):
        logging.warning("Usuario o email no válidos")#IP
        return jsonify({"warning": "Credenciales inválidas"}), 200
        
    if next((user for user in get_users() if user['name'] == username), None):
        logging.warning(f"Username {username} already exists")
        return jsonify({"warning": "Usuario ya existe"}), 200

    if next((user for user in get_users() if user['email'] == email), None):
        logging.warning(f"Email {email} already exists")
        return jsonify({"warning": "Email ya existe"}), 200


    user = {
        "createdAt": datetime.utcnow().isoformat(timespec='milliseconds') + "Z",
        "name": username,
        "email": email,
        "password": bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8'),
        "posts": [],
        "followers": 0,
        "followedBy": [],
        "id": str(len(users) + 1)
    }

    create_user(user)
    logging.info(f"User {user['id']} logged in successfully")
    return jsonify({'name': user['name'], 'token': 'token'}), 200 #Token    

@app.route('/api/blogs', methods=['GET'])
def get_blogs():
    blogs = load_data(BLOGS_FILE)
    logging.info("Fetched all blogs")
    return jsonify(blogs), 200

@app.route('/api/blogs/<int:blog_id>', methods=['GET'])
def get_blog_by_id(blog_id):
    blogs = load_data(BLOGS_FILE)
    blog = next((blog for blog in blogs if blog['id'] == str(blog_id)), None)
    if blog:
        logging.info(f"Blog {blog_id} fetched successfully")
        return jsonify(blog), 200
    else:
        logging.warning(f"Blog {blog_id} not found")
        return jsonify({"message": "Blog not found"}), 404

@app.route('/api/blogs', methods=['POST'])
def create_blog():
    new_blog = request.get_json()
    blogs = load_data(BLOGS_FILE)
    new_blog['id'] = str(len(blogs) + 1)
    new_blog['createdAt'] = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    blogs.append(new_blog)

    save_data(BLOGS_FILE, blogs)
    logging.info(f"Blog {new_blog['id']} created successfully")
    return jsonify(new_blog), 201

@app.route('/api/blogs/<int:blog_id>', methods=['PUT'])
def new_comment(blog_id):
    blogs = load_data(BLOGS_FILE)
    blog = next((blog for blog in blogs if blog['id'] == str(blog_id)), None)
    if blog:
        comment = request.get_json()
        comment['id'] = f"{blog_id}{comment['userId']}{len(blog['comments']) + 1}"
        blog['comments'].append(comment)
        blog['rating'] = sum(comment['rating'] for comment in blog['comments']) / len(blog['comments'])
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
        return jsonify(blog['comments']), 200
    else:
        logging.warning(f"Blog {blog_id} not found")
        return jsonify({"message": "Blog not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
