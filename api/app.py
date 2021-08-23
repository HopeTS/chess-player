from flask import Flask, request, session
from flask_cors import CORS
import logging
import json

from .chess.Chess import Chess


# Flask config
app = Flask(__name__)
CORS(app, resources=r"/api/*")
app.secret_key = "3psdughpds98gy"

# Log config
log = logging.getLogger("chess")
log.setLevel(logging.DEBUG)
handler = logging.FileHandler("app.log", "w", "utf-8")
formatter = logging.Formatter("%(name)s %(message)s")
handler.setFormatter(formatter)
log.addHandler(handler)


@app.route("/api/chess/start_game")
def start_game():
    log.debug("/chess/start endpoint called")
    x = Chess()
    x.start_new_game()

    session["game"] = x.to_json()
    return session["game"]


@app.route("/api/chess/make_move", methods=["POST"])
def make_move():
    log.debug("/chess/move endpoint called")
    if not "game" in session:
        return {}

    move = json.loads(request.data)["move"]
    x = Chess()
    x.from_json(session["game"])
    moveSuccess = x.make_move(move)
    x.log_state()
    if moveSuccess:
        session["game"] = x.to_json()
    return x.to_json()
