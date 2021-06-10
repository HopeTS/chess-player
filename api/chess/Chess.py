from typing import TypedDict


class PieceDict(TypedDict):
    coords: list
    piece: int
    team: int


class Chess:
    """
    The chess board is set up with a set of matrices, one containing white
    pieces and the other containing black pieces.

    :param white: white pieces matrix

    :param black: black pieces matrix

    :param history: a list of moves from one set of coordinates to the other.
    Whos move it is is determined by history.length % 2

    :param move: the set of coordinates to move a piece from move[0] to move[1]
    """


    def __init__(self, white = None, black = None, history = []):
        """ Initialize board """

        if not (white and black):
            self.start_new_game()
        return


    # User controls (Functions user calls directly to play game)
    def start_new_game(self):
        """ Set up new chess game state """

        self.white = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [2, 3, 4, 5, 6, 4, 3, 2]
        ]

        self.black = [
            [2, 3, 4, 5, 6, 4, 3, 2],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]

        self.castle = [
            [True, True, True], # Black: [0, 0] rook, King, [0, 7] rook
            [True, True, True]  # White: [7, 0] rook, King, [7, 7] rook
        ]

        self.history = []
        return

    
    def make_move(self, moveFrom, moveTo) -> bool:
        """
        Make move

        :param moveFrom: piece coordinates
        :param moveTo: coordinates to move piece to

        :return bool: whether or not move was successful
        """

        # Get piece
        piece = self.get_piece(moveFrom)
        if not piece:
            return False

        print('Here is the piece')
        print(piece)

        # Check turn
        if not self.turn() == piece['team']:
            return False
        
        # Check if it is within their legal moves
        self.get_possible_moves(piece)

        # Make move and handle capture
        #TODO: Handle en passant?
        #TODO: Handle pawn reaching opposing end of the board?
        if piece['team'] == 0:
            self.white[moveFrom[0]][moveFrom[1]] = 0
            self.white[moveTo[0]][moveTo[1]] = piece['piece']
            self.black[moveTo[0]][moveTo[1]] = 0
        else:
            self.black[moveFrom[0]][moveFrom[1]] = 0
            self.black[moveTo[0]][moveTo[1]] = piece['piece']
            self.white[moveTo[0]][moveTo[1]] = 0

        # Check king check
        if self.get_king_check(piece['team']):
            return False
        #TODO: Append to history
        return
    # End User controls


    # Game state getters
    def get_king_check(self, team):
        """
        Check king check status based on current condition of the board

        :param team: side to check (0 = white, 1 = black)
        """

        return


    def turn(self):
        """
        Determine whos turn it is

        :return int: white = 0, black = 1
        """

        return len(self.history) % 2


    def get_possible_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """
        Return all the possible move paths of a piece in the given coordinates

        :return list or None: list of paths of legal moves, or None
        """

        paths = [] # list of coordinate paths to be returned

        if (piece['piece'] == 1):

            # Evaluate white
            if piece['team'] == 0:

                # First move
                if piece['coords'][0] == 6:
                    path = []
                    for i in range(2):
                        path.append([piece['coords'][0] - (i + 1), piece['coords'][1]])
                    paths.append(path)
                
                # Normal move
                elif piece['coords'][0] > 0:
                    paths.append([piece['coords'][0] - 1, piece['coords'][1]])

                # Capture left
                captureLeft = [piece['coords'][0] - 1, piece['coords'][1] - 1]
                if self.is_on_board(captureLeft):
                    if not self.is_empty(captureLeft):
                        paths.append(captureLeft)

                # Capture right
                captureRight = [piece['coords'][0] - 1, piece['coords'][1] + 1]
                if self.is_on_board(captureRight):
                    if not self.is_empty(captureRight):
                        paths.append(captureRight)

                # En passant
                if piece['coords'][0] == 3:

                    # En passant left
                    enPassant = [piece['coords'][0], piece['coords'][1] - 1]
                    if self.is_on_board(enPassant):
                        enPassantPiece = self.get_piece(enPassant)
                        if enPassantPiece['piece'] == 1 and enPassantPiece['team'] == 0:

                            # Check if last move was the en passant pawn's double move
                            lastMove = self.history[len(self.history) - 1]
                            enPassantCoords = [ # The coordinates the enPassantPiece would have if it can be captured
                                [1, enPassantPiece['coords'][1] - 1],
                                enPassantPiece['coords']
                            ]

                            if lastMove == enPassantCoords:
                                paths.append(enPassant)

                    # En passant right
                    enPassant = [piece['coords'][0], piece['coords'][1] + 1]
                    if self.is_on_board(enPassant):
                        enPassantPiece = self.get_piece(enPassant)
                        if enPassantPiece['piece'] == 1 and enPassantPiece['team'] == 0:

                            # Check if last move was the en passant pawn's double move
                            lastMove = self.history[len(self.history) - 1]
                            enPassantCoords = [ # The coordinates the enPassantPiece would have if it can be captured 
                                [1, enPassantPiece['coords'][1] + 1],
                                enPassantPiece['coords']
                            ]

                            if lastMove == enPassantCoords:
                                paths.append(enPassant)

            # Evaluate black
            else:

                # First move
                if piece['coords'][0] == 1:
                    path = []
                    for i in range(2):
                        path.append([piece['coords'][0] + (i + 1), piece['coords'][1]])
                    paths.append(path)
                
                # Normal move
                elif piece['coords'][0] > 0:
                    paths.append([piece['coords'][0] + 1, piece['coords'][1]])

                # Capture left
                captureLeft = [piece['coords'][0] + 1, piece['coords'][1] - 1]
                if self.is_on_board(captureLeft):
                    if not self.is_empty(captureLeft):
                        paths.append(captureLeft)

                # Capture right
                captureRight = [piece['coords'][0] + 1, piece['coords'][1] + 1]
                if self.is_on_board(captureRight):
                    if not self.is_empty(captureRight):
                        paths.append(captureRight)

                # En passant
                if piece['coords'][0] == 4:

                    # En passant left
                    enPassant = [piece['coords'][0], piece['coords'][1] - 1]
                    if self.is_on_board(enPassant):
                        enPassantPiece = self.get_piece(enPassant)
                        if enPassantPiece['piece'] == 1 and enPassantPiece['team'] == 0:

                            # Check if last move was the en passant pawn's double move
                            lastMove = self.history[len(self.history) - 1]
                            enPassantCoords = [ # The coordinates the enPassantPiece would have if it can be captured
                                [6, enPassantPiece['coords'][1] - 1],
                                enPassantPiece['coords']
                            ]

                            if lastMove == enPassantCoords:
                                paths.append(enPassant)

                    # En passant right
                    enPassant = [piece['coords'][0], piece['coords'][1] + 1]
                    if self.is_on_board(enPassant):
                        enPassantPiece = self.get_piece(enPassant)
                        if enPassantPiece['piece'] == 1 and enPassantPiece['team'] == 0:

                            # Check if last move was the en passant pawn's double move
                            lastMove = self.history[len(self.history) - 1]
                            enPassantCoords = [ # The coordinates the enPassantPiece would have if it can be captured 
                                [6, enPassantPiece['coords'][1] + 1],
                                enPassantPiece['coords']
                            ]

                            if lastMove == enPassantCoords:
                                paths.append(enPassant)

            # TODO: Capture
            # TODO: Evaluate en passant
            return
        
        elif (piece['piece'] == 2):
            # TODO: Evaluate castle
            return

        elif (piece['piece'] == 3):
            return

        elif (piece['piece'] == 4):
            return

        elif (piece['piece'] == 5):
            return

        elif (piece['piece'] == 6):
            # TODO: Evaluate castle
            return

        else:
            return None

        # TODO: get all legal paths of that piece
        # TODO: for each coord in path, cut it off before friendly piece or on enemy piece
        if not paths:
            return None
        return paths


    def get_piece(self, coords: list) -> PieceDict or None:
        """ Given board coords, find piece type, team and coords """

        piece = None
        team =  None
        if not self.white[coords[0]][coords[1]] == 0:
            return {
                'piece': self.white[coords[0]][coords[1]],
                'team': 0,
                'coords': coords
            }

        elif not self.black[coords[0]][coords[1]] == 0:
            return {
                'piece': self.black[coords[0]][coords[1]],
                'team': 0,
                'coords': coords
            }

        else:
            return None

    
    def is_empty(self, coords):
        """ 
        Get piece status of the board

        :return int: 0 = empty, 1 = white piece exists, 2 = black piece exists
        """

        if not self.white[coords[0]][coords[1]] == 0:
            return 1
        elif not self.black[coords[0]][coords[1]] == 0:
            return 2
        else:
            return 0


    def is_on_board(self, coords) -> bool:
        """ Check whether given coordinates are on the board """

        if coords[0] < 0 or coords[0] > 7:
            return False
        elif coords[1] < 0 or coords[1] > 7:
            return False
        else:
            return True
    # End Game state getters


    # Data getters / print
    def print_ascii(self):
        """
        Prints out an ascii version of the board
        """

        # Combine white and black pieces
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]

        for i in range(8):
            for j in range(8):
                board[i][j] = self.white[i][j] + self.black[i][j]

        for rank in board:
            print(rank)
        return


    def to_json(self):
        """ Convert to json serializable object """

        return {
            "white": self.white,
            "black": self.black,
            "history": self.history,
            "castle": self.castle
        }
    # End data getters / print