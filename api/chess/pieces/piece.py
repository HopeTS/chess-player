from abc import ABC, abstractmethod


class Piece(ABC):
    """ Piece abstract class """


    def __init__(self, coords: "list[int, int]", white: bool):

        # Piece coordinates
        self.coords: list[int, int] = coords

        # List of all valid moves (update when piece coords change)
        self.validMoves: list[list[int, int]] = []
        
        self.white = white
        self.moveCount = 0
        self.kingThreat = None
        pass


    def is_valid_move(self, newCoordinates: "list[int, int]") -> bool:
        """ 
        validate move of piece based on current coordinates\n
        return true if valid move, else false
        """

        return newCoordinates in self.validMoves


    def move_is_on_board(self, coords: "list[int, int]") -> bool:
        """ Check whether new coordinates are on board """
        
        return (
            (coords[0] < 8) and (coords[0] >= 0) and 
            (coords[1] < 8) and coords[1] >= 0
        )


    def move_piece(self, newCoordinates: "list[int, int]") -> bool:
        """ 
        move piece\n
        return true if successful, else false
        """
        
        try:
            if (self.is_valid_move(newCoordinates)):
                self.coords = newCoordinates
                self.moveCount += 1
                return True
            return False


        except:
            return False


    @abstractmethod
    def update_valid_moves(self, enemyTeam, sameTeam):
        """ 
        Update list of all possible moves, also handles kingThreat
        """
        pass


    @abstractmethod
    def update_king_threat(self, enemyTeam, sameTeam):
        """ Check for direct or possible discovery check on enemy king """
        pass