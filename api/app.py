from flask import Flask, jsonify
from flask.wrappers import Response

from .chess.pieces.bishop import Bishop
from .chess.board.board import Board

app = Flask(__name__)


x = Board()
print(x.get())


@app.route('/pawn')
def get_pawn():
    x = Bishop()
    print('Here are bishop valid moves', x.validMoves)
    return {'moves': x.validMoves}


@app.route('/start-game')
def post_start_game():
    board = Board()
    data = board.get()
    return {'board': data}
