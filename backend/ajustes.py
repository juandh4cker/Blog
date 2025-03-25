import os, json

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


users = load_data(USERS_FILE)
blogs = load_data(BLOGS_FILE)

for blog in blogs:
    try:
        comments = blog['comments']
        i = 1
        for comment in comments:
            user = next((user for user in users if user['username'] == comment['username']), None)
            comment['id'] = int(f"{blog['id']}{user['id']}{i}")
        i += 1
    except:
        comment['id'] = 0

save_data(BLOGS_FILE, blogs)