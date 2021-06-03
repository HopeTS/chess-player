from .Piece import Piece


class Rook(Piece):
    """ Rook piece """


    def __init__(self, coords, white, moveCount = 0):
        
        super(Rook, self).__init__(
            coords = coords, white = white, moveCount = moveCount
        )
        self.type = 'rook'
        return


    def get_paths(self):
        return []