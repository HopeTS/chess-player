from .piece import Piece


class Pawn(Piece):


    def __init__(self, coords: "list[int, int]" = [5, 5]):
        super().__init__(self)
        
        self.coords = coords
        self.type = 'pawn'
        return


    def get_possible_moves(self):

        return