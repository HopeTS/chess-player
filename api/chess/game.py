from .pieces.pawn import Pawn
from .pieces.rook import Rook
from .pieces.knight import Knight
from .pieces.bishop import Bishop
from .pieces.king import King
from .pieces.queen import Queen


class Game:


    def __init__(self):

        self.clear_board()
        return


    def clear_board(self):
        """ Reset board """

        self.state = {
            "whitePieces": [],
            "blackPieces": [],
            "whiteCheck": False,
            "blackCheck": False,
            "whiteCheckMate": False,
            "blackCheckMate": False,
            "whiteTurn": True
        }

        self.nextState = {
            "whitePieces": [],
            "blackPieces": [],
            "whiteCheck": False,
            "blackCheck": False,
            "whiteCheckMate": False,
            "blackCheckMate": False,
            "whiteTurn": True
        }
        return


    def start(self):
        """ Starts a new chess game """

        self.clear_board()

        # Set up pawns
        for i in range(8):
            x = Pawn(coords=[i, 1])
            self.state['whitePieces'].append(x)
        for i in range(8):
            x = Pawn(coords=[i, 6])
            self.state['blackPieces'].append(x)

        # Set up white
        self.state['whitePieces'].append(Rook(coords=[0, 0]))
        self.state['whitePieces'].append(Rook(coords=[7, 0]))
        self.state['whitePieces'].append(Knight(coords=[1, 0]))
        self.state['whitePieces'].append(Knight(coords=[6, 0]))
        self.state['whitePieces'].append(Bishop(coords=[2, 0]))
        self.state['whitePieces'].append(Bishop(coords=[5, 0]))
        self.state['whitePieces'].append(King(coords=[3, 0]))
        self.state['whitePieces'].append(Queen(coords=[4, 0]))

        # Set up black
        self.state['blackPieces'].append(Rook(coords=[0, 7]))
        self.state['blackPieces'].append(Rook(coords=[7, 7]))
        self.state['blackPieces'].append(Knight(coords=[1, 7]))
        self.state['blackPieces'].append(Knight(coords=[6, 7]))
        self.state['blackPieces'].append(Bishop(coords=[2, 7]))
        self.state['blackPieces'].append(Bishop(coords=[5, 7]))
        self.state['blackPieces'].append(King(coords=[4, 7]))
        self.state['blackPieces'].append(Queen(coords=[3, 7]))
        return


    def next_turn(self, pieceCoords: "list[int, int]", moveCoords: "list[int, int]") -> bool:
        """ Validates and plays next turn. Returns True if successful """

        try:

            # Try move
            move = self.__move_piece(pieceCoords, moveCoords)
            if (not move):
                return False

            # Update game state
            self.state['whiteTurn'] = not self.state['whiteTurn']
            return True

        except:
            return False


    def __get_piece(self, coords: "list[int, int]"):
        """ Returns piece from spefic coordinate in current turn, None if empty """

        for piece in self.nextState['whitePieces']:
            if piece.coords == coords:
                return piece

        for piece in self.nextState['blackPieces']:
            if piece.coords == coords:
                return piece

        return


    def __get_next_piece(self, coords: "list[int, int]"):
        """ Returns piece from spefic coordinate in next turn, None if empty """

        for piece in self.nextState['whitePieces']:
            if piece.coords == coords:
                return piece

        for piece in self.nextState['blackPieces']:
            if piece.coords == coords:
                return piece

        return None


    def __move_piece(self, curCoords: "list[int, int]", moveCoords: "list[int, int]") -> bool:
        """ 
        Move piece from one square to another\n
        Handles castling and capturing\n
        returns true if successful 
        """

        # Validate move
        if not self.__is_valid_move(curCoords, moveCoords):
            return False

        try:
            # find piece
            self.__get_piece(curCoords).__move_piece(moveCoords)
            return True

            # TODO: Detect and handle castling
            # TODO: Detect and handle capturing
        
        except:
            return False


    def __move_next_piece(self, cur: "list[int, int]", moveTo: "list[int, int]") -> bool:
        """
        Simulate next move to see if it puts own team in check or checkmate\n
        returns True if move is legal
        """
        return
        

    def __is_valid_move(self, cur: "list[int, int]", moveTo: "list[int, int]") -> bool:
        """ 
        Check if move is valid by simulating the next turn and seeing if it breaks the rules
        """

        # Check if checkmate
        if (self.whiteCheckMate or self.blackCheckMate):
            return False

        self.nextState = self.state

        # Check if move valid
        piece = self.__get_next_piece(cur)

        # Is it this players turn?
        if (piece.white != self.state['whiteTurn']):
            return False

        # Does the move follow the rules of the piece?
        if piece.__is_valid_move(moveTo):
            return True

        self.__move_next_piece(curCoords=cur, moveCoords=moveTo)
        
        # Does move get team out of check?
        if (self.state['whiteTurn'] and (self.state['whiteCheck'] and self.nextState['whiteCheck'])):
            return False
        if (not self.state['whiteTurn'] and (self.state['blackCheck'] and self.nextState['blackCheck'])):
            return False

        # Does move put team in check
        if (self.state['whiteTurn'] and self.nextState['whiteCheck']):
            return False
        if (not self.state['whiteTurn'] and self.nextState['blackCheck']):
            return False

        # TODO: If in check, does move take team out of check?
        return False


    def __update_valid_next_moves(self):
        """ Update moves of all pieces in next state """

        for piece in self.nextState['whitePieces']:
            piece.update_valid_moves(
                sameTeam=self.nextState['whitePieces'],
                otherTeam=self.nextState['blackPieces']
            )

        for piece in self.nextState['blackPieces']:
            piece.update_valid_moves(
                sameTeam=self.nextState['blackPieces'],
                otherTeam=self.nextState['whitePieces']
            )