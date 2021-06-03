from .Piece import Piece


class Bishop(Piece):
    """ Bishop piece """


    def __init__(self, coords, white, moveCount = 0):
        
        super(Bishop, self).__init__(
            coords = coords, white = white, moveCount = moveCount
        )
        self.type = 'bishop'
        return


    def get_paths(self):
        return []