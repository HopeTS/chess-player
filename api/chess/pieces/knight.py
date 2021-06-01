from .piece import Piece


class Knight(Piece):


    def __init__(self, coords: "list[int, int]" = [5, 5]):
        super().__init__(self)
        
        self.coords = coords
        self.type = 'knight'
        return


    def get_possible_moves(self):

        newCoords = [
            [self.coords[0] + 2, self.coords[1] + 1],
            [self.coords[0] + 2, self.coords[1] - 1],
            [self.coords[0] - 2, self.coords[1] + 1],
            [self.coords[0] - 2, self.coords[1] - 1],
            [self.coords[0] + 1, self.coords[1] + 2],
            [self.coords[0] - 1, self.coords[1] + 2],
            [self.coords[0] + 1, self.coords[1] - 2],
            [self.coords[0] - 1, self.coords[1] - 2]
        ]

        for move in newCoords:
            if not self.move_is_on_board(move):
                newCoords.pop(move)
        return