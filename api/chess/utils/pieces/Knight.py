from .Piece import Piece


class Knight(Piece):
    """ Knight piece """


    def __init__(self, coords, white, moveCount = 0):
        
        super(Knight, self).__init__(
            coords = coords, white = white, moveCount = moveCount
        )
        self.type = 'knight'
        return


    def get_paths(self):
        return []