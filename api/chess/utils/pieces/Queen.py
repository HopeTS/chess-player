from .Piece import Piece


class Queen(Piece):
    """ Queen piece """


    def __init__(self, coords, white, moveCount = 0):
        
        super(Queen, self).__init__(
            coords = coords, white = white, moveCount = moveCount
        )
        self.type = 'queen'
        return


    def get_paths(self):
        return []