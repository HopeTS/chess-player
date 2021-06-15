from flask import Flask, request, session
import logging

from .chess.Chess import Chess


# Flask config
app = Flask(__name__)
app.secret_key = '3psdughpds98gy'

# Log config
log = logging.getLogger('chess')
log.setLevel(logging.DEBUG)
handler = logging.FileHandler('app.log', 'w', 'utf-8')
formatter = logging.Formatter('%(name)s %(message)s')
handler.setFormatter(formatter)
log.addHandler(handler)


@app.route('/chess/start')
def get_start():
    log.debug('/chess/start endpoint called')
    x = Chess()
    x.start_new_game()

    session['game'] = x.to_json()
    return session['game']


@app.route('/chess/move', methods=['POST'])
def post_move():
    log.debug('/chess/move endpoint called')
    if not 'game' in session:
        return {}

    print(request.move)

    session['game'].move(request.state)
    return {session['game'].get()}