import json
import os
import logging
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
    users = load_data(USERS_FILE)
    logging.info("Fetched all users")
    return jsonify(users), 200

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

@app.route('/api/users', methods=['POST'])
def create_user():
    new_user = request.get_json()
    users = load_data(USERS_FILE)
    new_user['id'] = str(len(users) + 1)  # Asignar un ID único al nuevo usuario
    new_user['createdAt'] = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    users.append(new_user)

    save_data(USERS_FILE, users)
    logging.info(f"User {new_user['id']} created successfully")
    return jsonify(new_user), 201

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

if __name__ == '__main__':
    app.run(debug=True)
