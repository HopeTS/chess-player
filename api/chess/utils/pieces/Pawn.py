from .Piece import Piece


class Pawn(Piece):
    """ Pawn piece """


    def __init__(self, coords, white, enPassant = False, moveCount = 0):
        
        super(Pawn, self).__init__(
            coords = coords, white = white, 
            moveCount = moveCount
        )
        self.type = 'pawn'
        self.enPassant = enPassant
        return


    def get(self):
        """ Returns piece data """

        return {
            "type": self.type,
            "coords": self.coords,
            "moveCount": self.moveCount,
            "enPassant": self.enPassant,
            "white": self.white
        }


    def get_paths(self):
        """
        Return possible move paths

        :type list[list[int, int]]: coordinates
        """

        # white moves down, black moves up
        if self.white:
            if self.moveCount == 0:
                return [
                    [self.coords[0] - 1, self.coords[1]],
                    [self.coords[0] - 2, self.coords[1]]
                ]
            return [[self.coords[0] - 1, self.coords[1]]]
                
        else:
            if self.moveCount == 0:
                return [
                    [self.coords[0] + 1, self.coords[1]],
                    [self.coords[0] + 2, self.coords[1]]
                ]
            return [[self.coords[0] + 1, self.coords[1]]]

        return


    def get_attack_paths(self):
        """ 
        Return possible capture paths 

        :type list[list[int, int]]: attack coordinates
        """

        # white moves down, black moves up
        if self.white:
            return [
                [self.coords[0] + 1, self.coords[1] + 1], 
                [self.coords[0] + 1, self.coords[1] - 1]
            ]

        else:
            return [
                [self.coords[0] - 1, self.coords[1] + 1], 
                [self.coords[0] - 1, self.coords[1] - 1]
            ]
