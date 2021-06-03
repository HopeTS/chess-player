from .pieces.Pawn import Pawn
from .pieces.Rook import Rook
from .pieces.Knight import Knight
from .pieces.Bishop import Bishop
from .pieces.Queen import Queen
from .pieces.King import King


class Chess:
    """ 
    Creates board, takes in state of game and potential move, validates the move
    and updates the state of the game if the move is valid
    \n
    The board coordinates start from the top left [0, 0] to the bottom right
    [7, 7]. White starts on top [0, 0], [7, 1] and black starts on the bottom 
    [0, 6], [7, 7]
    \n
    The board state that is taken as an argument and also returned is a 
    dictionary containing two identically structured team keys, white and black.
    \n
    The teams contain the following information:
    \n
    :pieces: The information about each piece. This is gotten from each 
        piece's get() function

    :param state: The starting state of the game, before the move
    :param move: The coordinates of the piece to move and where to move it to
    """


    def __init__(self, state = None, move = None):
        """ Initialize board """

        # Set up board
        if not state:
            self.start_new_game()
        else:
            self.set_up_board(state)
        return


    def start_new_game(self):
        """ Set up new chess game state """

        self.state = {
            "white": [],
            "black": []
        }

        # Set up white
        for i in range(8):
            self.state['white'].append(Pawn(coords = [i, 1], white = True))
        self.state['white'].append(Rook(coords = [0, 0], white = True))
        self.state['white'].append(Rook(coords = [7, 0], white = True))
        self.state['white'].append(Knight(coords = [1, 0], white = True))
        self.state['white'].append(Knight(coords = [6, 0], white = True))
        self.state['white'].append(Bishop(coords = [2, 0], white = True))
        self.state['white'].append(Bishop(coords = [5, 0], white = True))
        self.state['white'].append(King(coords = [3, 0], white = True))
        self.state['white'].append(Queen(coords=[4, 0], white = True))


        # Set up black
        for i in range(8):
            self.state['black'].append(Pawn(coords = [i, 6], white = False))
        self.state['black'].append(Rook(coords = [0, 7], white = False))
        self.state['black'].append(Rook(coords = [7, 7], white = False))
        self.state['black'].append(Knight(coords = [1, 7], white = False))
        self.state['black'].append(Knight(coords = [6, 7], white = False))
        self.state['black'].append(Bishop(coords = [2, 7], white = False))
        self.state['black'].append(Bishop(coords = [5, 7], white = False))
        self.state['black'].append(King(coords = [3, 7], white = False))
        self.state['black'].append(Queen(coords = [4, 7], white = False))
        return


    def set_up_board(self, state):
        """ Set up board state based on state init argument """

        try:
            # Set up white
            for pieceData in state['white']:
                if pieceData.type == 'pawn':
                    self.state['white'].append(
                        Pawn(
                            coords = pieceData.coords, 
                            moveCount = pieceData.moveCount,
                            white = pieceData.white,
                            enPassant = pieceData.enPassant
                        )
                    )

                elif pieceData.type == 'rook':
                    self.state['white'].append(
                        Rook(
                            coords = pieceData.coords, 
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'knight':
                    self.state['white'].append(
                        Knight(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'bishop':
                    self.state['white'].append(
                        Bishop(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'queen':
                    self.state['white'].append(
                        Queen(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'king':
                    self.state['white'].append(
                        King(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                else:
                    TypeError('Invalid piece type.')

            # Set up black
            for pieceData in state['black']:
                if pieceData.type == 'pawn':
                    self.state['black'].append(
                        Pawn(
                            coords = pieceData.coords, 
                            moveCount = pieceData.moveCount,
                            white = pieceData.white,
                            enPassant = pieceData.enPassant
                        )
                    )

                elif pieceData.type == 'rook':
                    self.state['black'].append(
                        Rook(
                            coords = pieceData.coords, 
                            moveCount = pieceData.moveCount,
                            white = pieceData.white

                        )
                    )

                elif pieceData.type == 'knight':
                    self.state['black'].append(
                        Knight(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'bishop':
                    self.state['black'].append(
                        Bishop(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'queen':
                    self.state['black'].append(
                        Queen(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                elif pieceData.type == 'king':
                    self.state['black'].append(
                        King(
                            coords = pieceData.coords,
                            moveCount = pieceData.moveCount,
                            white = pieceData.white
                        )
                    )

                else:
                    TypeError('Invalid piece type.')
            return

        except:
            return

    
    def move(self):
        """ 
        Performs the move if a move was given

        :type bool: whether or not move was successful
        """

        def premove_step():
            """ 
            Performs the premove step

            :type bool: whether or not step was successful
            """
            
            # TODO
            return True

        def move_step():
            """
            Performs the move step

            :type bool: whether or not step was successful
            """

            # TODO
            return True

        def postmove_step():
            """
            Performs the postmove step

            :type bool: whether or not step was successful
            """

            # TODO
            return True

        if not premove_step():
            return False
        
        if not move_step():
            return False

        if not postmove_step():
            return False

        # TODO: update board state
        return


    def print_ascii(self):
        """
        Prints out an ascii version of the board
        """

        # Create empty board
        chessBoard = []
        for i in range(8):
            row = []
            for j in range(8):
                row.append('-')
            chessBoard.append(row)

        # White
        for piece in self.state['white']:

            # Get symbol
            letter = None
            if piece.type == 'pawn':
                letter = 'p'
            elif piece.type == 'rook':
                letter = 'r'
            elif piece.type == 'knight':
                letter = 'k'
            elif piece.type == 'bishop':
                letter = 'b'
            elif piece.type == 'king':
                letter = 'K'
            elif piece.type == 'queen':
                letter = 'q'

            # Add to board
            if letter:
                chessBoard[piece.coords[0]][piece.coords[1]] = letter

        # Black
        for piece in self.state['black']:

            # Get symbol
            letter = None
            if piece.type == 'pawn':
                letter = 'p'
            elif piece.type == 'rook':
                letter = 'r'
            elif piece.type == 'knight':
                letter = 'k'
            elif piece.type == 'bishop':
                letter = 'b'
            elif piece.type == 'king':
                letter = 'K'
            elif piece.type == 'queen':
                letter = 'q'

            # Add to board
            if letter:
                chessBoard[piece.coords[0]][piece.coords[1]] = letter

        for row in chessBoard:
            print(row)
        return


    def get(self):
        """
        Returns data about state of chess board (to be sent to client)
        """

        data = {
            "white": [],
            "black": []
        }

        for piece in self.state['white']:
            data['white'].append(piece.get())

        for piece in self.state['black']:
            data['black'].append(piece.get())

        return data
