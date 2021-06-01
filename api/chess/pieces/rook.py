from .piece import Piece


class Rook(Piece):


    def __init__(self, coords: "list[int, int]" = [5, 5]):
        super().__init__(self)
        
        self.coords = coords
        self.type = 'rook'
        return


    def get_possible_moves(self):

        possibleMoves = []

        # North/South
        for i in range(8):
            if (i != self.coords[1]):
                possibleMoves.append[self.coords[0], i]
        
        # North/South
        for i in range(8):
            if (i != self.coords[0]):
                possibleMoves.append[i, self.coords[1]]

        return possibleMoves