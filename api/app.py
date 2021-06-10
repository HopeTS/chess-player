from flask import Flask, jsonify, request, session

from .chess.Chess import Chess


# Flask config
app = Flask(__name__)
app.secret_key = '3psdughpds98gy'


@app.route('/chess/start')
def get_start():
    x = Chess()
    x.print_ascii()

    print('Moving white pawn')
    x.make_move(moveFrom=[6, 2], moveTo=[4, 2])
    x.print_ascii()
    session['game'] = x.to_json()
    return session['game']


@app.route('/chess/move', methods=['POST'])
def post_move():
    print(request)
    if not 'game' in session:
        return {}

    session['game'].move(request.state)
    print(session['game'].get())
    return {session['game'].get()}