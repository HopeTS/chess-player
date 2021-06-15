from flask import Flask, request, session
import logging
import json

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

    move = json.loads(request.data)['move']
    x = Chess()
    x.from_json(session['game'])
    moveSuccess = x.make_move(move)
    x.log_state()
    if moveSuccess:
        print('move success')
        session['game'] = x.to_json()
    return session['game']