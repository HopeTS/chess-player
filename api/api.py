import time
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)


@app.route('/time')
def get_current_time():
    client = MongoClient()
    db = client['test-database']
    collection = db['test-collection']
    post = {"Name": "Robby"}
    posts = db.posts
    post_id = posts.insert_one(post).inserted_id
    return {'postid': post_id}