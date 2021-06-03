from .Piece import Piece


class King(Piece):
    """ King piece """


    def __init__(self, coords, white, moveCount = 0):
        
        super(King, self).__init__(
            coords = coords, white = white, moveCount = moveCount
        )
        self.type = 'king'
        return



    def get_paths(self):
        return []