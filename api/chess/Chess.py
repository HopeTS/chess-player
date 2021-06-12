from typing import TypedDict
import logging


# Configure logging
log = logging.getLogger('chess')


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
        log.debug('Initializing Chess')

        if not (white and black):
            self.start_new_game()
        return


    # User controls (Functions user calls directly to play game)
    def start_new_game(self):
        """ Set up new chess game state """
        log.debug('Starting new game')
        
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
        log.debug('Making move from %s to %s' % (moveFrom, moveTo))

        # Get piece
        piece = self.get_piece(moveFrom)
        if not piece:
            return False

        # Check turn
        if not self.turn() == piece['team']:
            return False
        
        # Check if it is within their legal moves
        self.get_moves(piece)

        # Make move and handle capture
        #TODO: Handle pawn reaching opposing end of the board?
        #TODO: Handle en passant
        if piece['team'] == 0:
            self.white[moveFrom[0]][moveFrom[1]] = 0
            self.white[moveTo[0]][moveTo[1]] = piece['piece']
            self.black[moveTo[0]][moveTo[1]] = 0

            # Handle en passant
            if (piece['piece'] == 1) and (moveFrom[0] == 3) and (not moveFrom[1] == moveTo[1]):
                self.black[moveFrom[0]][moveTo[1]] = 0

        else:
            self.black[moveFrom[0]][moveFrom[1]] = 0
            self.black[moveTo[0]][moveTo[1]] = piece['piece']
            self.white[moveTo[0]][moveTo[1]] = 0

            # Handle en passant
            if (piece['piece'] == 1) and (moveFrom[0] == 4) and (not moveFrom[1] == moveTo[1]):
                self.white[moveFrom[0]][moveTo[1]] = 0


        # Check king check
        if self.get_king_check(piece['team']):
            return False

        self.history.append([moveFrom, moveTo])
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


    def get_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """
        Return all the possible move paths of a piece in the given coordinates

        :return list or None: list of paths of legal moves, or None
        """

        # TODO: get all legal paths of that piece
        # TODO: for each coord in path, cut it off before friendly piece or on enemy piece

        # Pawn
        if piece['piece'] == 1:
            if piece['team'] == 0:
                return self.get_white_pawn_moves(piece)
            else:
                return self.get_black_pawn_moves(piece)

        # Rook
        elif piece['piece'] == 2:
            if piece['team'] == 0:
                return self.get_white_rook_moves(piece)
            else:
                return self.get_black_rook_moves(piece)

        # Knight
        elif piece['piece'] == 3:
            if piece['team'] == 0:
                return self.get_white_knight_moves(piece)
            else:
                return self.get_black_knight_moves(piece)

        # Bishop
        elif piece['piece'] == 4:
            if piece['team'] == 0: 
                return self.get_white_bishop_moves(piece)
            else:
                return self.get_black_bishop_moves(piece)

        # Queen
        elif piece['piece'] == 5:
            if piece['team'] == 0:
                return self.get_white_queen_moves(piece)
            else:
                return self.get_black_queen_moves(piece)

        # King
        elif piece['piece'] == 6:
            # TODO: Evaluate castle
            if piece['team'] == 0:
                return self.get_white_king_moves(piece)
            else:
                return self.get_black_king_moves(piece)

        else:
            log.warning('Piece passed to get_moves is invalid:')
            log.warning(piece)
            return None


    def get_white_pawn_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white pawn move paths """
        log.debug('Getting white pawn paths')

        paths = []

        # First move
        if piece['coords'][0] == 6:
            path = []
            for i in range(2):
                coords = [piece['coords'][0] - (i + 1), piece['coords'][1]]
                if not self.has_piece(coords):
                    path.append(coords)
                else:
                    break
            paths.append(path)
        
        # Normal move
        elif piece['coords'][0] > 0:
            coords = [piece['coords'][0] - 1, piece['coords'][1]]
            if not self.has_piece(coords):
                paths.append(coords)

        # Capture left
        captureLeft = [piece['coords'][0] - 1, piece['coords'][1] - 1]
        if self.is_on_board(captureLeft):
            if not self.has_piece(captureLeft):
                paths.append(captureLeft)

        # Capture right
        captureRight = [piece['coords'][0] - 1, piece['coords'][1] + 1]
        if self.is_on_board(captureRight):
            if not self.has_piece(captureRight):
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

        log.info('Pawn paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return paths


    def get_black_pawn_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible black pawn move paths """
        log.debug('Getting black pawn paths')

        paths = []

        # First move
        if piece['coords'][0] == 1:
            path = []
            for i in range(2):
                coords = [piece['coords'][0] + (i + 1), piece['coords'][1]]
                if not self.has_piece(coords):
                    path.append([coords])
                else:
                    break
            paths.append(path)
        
        # Normal move
        elif piece['coords'][0] < 7:
            coords = [piece['coords'][0] + 1, piece['coords'][1]]
            if not self.has_piece(coords):
                paths.append([coords])

        # Capture left
        captureLeft = [piece['coords'][0] + 1, piece['coords'][1] - 1]
        if self.is_on_board(captureLeft):
            if not self.has_piece(captureLeft):
                paths.append([captureLeft])

        # Capture right
        captureRight = [piece['coords'][0] + 1, piece['coords'][1] + 1]
        if self.is_on_board(captureRight):
            if not self.has_piece(captureRight):
                paths.append([captureRight])

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
                        paths.append([enPassant])

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
                        paths.append([enPassant])      

        log.info('Pawn paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)  
        return paths


    def get_white_rook_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white rook move paths """
        log.debug('Getting rook paths')

        paths = []
            
        # TODO: Evaluate castle
        # TODO: List all possible paths

        # North
        path = []
        for i in range(piece['coords'][0], 0, -1):
            hasPiece = self.has_piece([i, piece['coords'][1]])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 1:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        # South
        path = []
        for i in range(piece['coords'][0], 8):
            hasPiece = self.has_piece([i, piece['coords'][1]])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 1:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        # Left
        #TODO: Castle
        path = []
        for i in range(piece['coords'][1], 0, -1):
            hasPiece = self.has_piece([piece['coords'][0], i])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 1:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        # Right
        #TODO: Castle
        path = []
        for i in range(piece['coords'][1], 8):
            hasPiece = self.has_piece([piece['coords'][0], i])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 1:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        log.info('Rook paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return paths


    def get_black_rook_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white rook move paths """
        log.debug('Getting rook paths')

        paths = []

        # North
        path = []
        for i in range(piece['coords'][0], 0, -1):
            hasPiece = self.has_piece([i, piece['coords'][1]])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 2:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        # South
        path = []
        for i in range(piece['coords'][0], 8):
            hasPiece = self.has_piece([i, piece['coords'][1]])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 2:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        # Left
        #TODO: castle
        path = []
        for i in range(piece['coords'][1], 0, -1):
            hasPiece = self.has_piece([piece['coords'][0], i])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 2:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        # Right
        #TODO: Castle
        path = []
        for i in range(piece['coords'][1], 8):
            hasPiece = self.has_piece([piece['coords'][0], i])
            if not hasPiece:
                path.append([i, piece['coords'][1]])
            elif hasPiece == 2:
                break
            else:
                path.append([i, piece['coords'][1]])
                break
        paths.append(path)

        log.info('Rook paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return paths

    
    def get_white_knight_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white knight move paths """
        log.debug('Getting knight paths')

        paths = []

        # Top left
        coords = [piece['coords'] - 2, piece['coords'] - 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])
        
        # Top right
        coords = [piece['coords'] - 2, piece['coords'] + 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])
                

        # Bottom left
        coords = [piece['coords'] + 2, piece['coords'] - 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])

        # Bottom right
        coords = [piece['coords'] + 2, piece['coords'] + 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])

        # Upper left
        coords = [piece['coords'] - 1, piece['coords'] - 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])

        # Lower left
        coords = [piece['coords'] + 1, piece['coords'] - 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])

        # Upper right
        coords = [piece['coords'] - 1, piece['coords'] + 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])

        # Lower right
        coords = [piece['coords'] + 1, piece['coords'] + 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])


        log.info('Knight paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return

    
    def get_black_knight_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible black knight move paths """
        log.debug('Getting knight paths')

        paths = []

        # Top left
        coords = [piece['coords'] - 2, piece['coords'] - 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])
        
        # Top right
        coords = [piece['coords'] - 2, piece['coords'] + 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])
                

        # Bottom left
        coords = [piece['coords'] + 2, piece['coords'] - 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])

        # Bottom right
        coords = [piece['coords'] + 2, piece['coords'] + 1]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])

        # Upper left
        coords = [piece['coords'] - 1, piece['coords'] - 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])

        # Lower left
        coords = [piece['coords'] + 1, piece['coords'] - 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])

        # Upper right
        coords = [piece['coords'] - 1, piece['coords'] + 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])

        # Lower right
        coords = [piece['coords'] + 1, piece['coords'] + 2]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 2:
                paths.append([coords])

        log.info('Knight paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return


    def get_white_bishop_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white bishop move paths """
        log.debug('Getting bishop paths')
        
        paths = []

        # NE
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # NW
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SE
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SW
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        log.info('Bishop paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return


    def get_black_bishop_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible black bishop move paths """
        log.debug('Getting bishop paths')
        
        paths = []

        # NE
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # NW
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SE
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SW
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        log.info('Bishop paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return


    def get_white_queen_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white queen move paths """
        log.debug('Getting queen paths')
        
        paths = []

        # North
        path = []
        for i in range(piece['coords'][0] -1, -1, -1):
            coords = [i, piece['coords'][1]]
            hasPiece = self.has_piece(coords)
            if hasPiece == 1:
                break
            elif hasPiece == 2:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)

        # South
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            coords = [i, piece['coords'][1]]
            hasPiece = self.has_piece(coords)
            if hasPiece == 1:
                break
            elif hasPiece == 2:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)
        
        # East
        path = []
        for i in range(piece['coords'][1] + 1, 8):
            coords = [piece['coords'][0], i]
            hasPiece = self.has_piece(coords)
            if hasPiece == 1:
                break
            elif hasPiece == 2:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)

        # West
        path = []
        for i in range(piece['coords'][1] - 1, -1, -1):
            coords = [piece['coords'][0], i]
            hasPiece = self.has_piece(coords)
            if hasPiece == 1:
                break
            elif hasPiece == 2:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)

        # NE
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # NW
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SE
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SW
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 1:
                    break
                elif hasPiece == 2:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        log.info('Queen paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return


    def get_black_queen_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible black queen move paths """
        log.debug('Getting queen paths')
        
        paths = []

        # North
        path = []
        for i in range(piece['coords'][0] -1, -1, -1):
            coords = [i, piece['coords'][1]]
            hasPiece = self.has_piece(coords)
            if hasPiece == 2:
                break
            elif hasPiece == 1:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)

        # South
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            coords = [i, piece['coords'][1]]
            hasPiece = self.has_piece(coords)
            if hasPiece == 2:
                break
            elif hasPiece == 1:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)
        
        # East
        path = []
        for i in range(piece['coords'][1] + 1, 8):
            coords = [piece['coords'][0], i]
            hasPiece = self.has_piece(coords)
            if hasPiece == 2:
                break
            elif hasPiece == 1:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)

        # West
        path = []
        for i in range(piece['coords'][1] - 1, -1, -1):
            coords = [piece['coords'][0], i]
            hasPiece = self.has_piece(coords)
            if hasPiece == 2:
                break
            elif hasPiece == 1:
                path.append(coords)
                break
            else:
                path.append(coords)
        paths.append(path)

        # NE
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # NW
        path = []
        for i in range(piece['coords'][0] - 1, -1, -1):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SE
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] + 1, 8):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        # SW
        path = []
        for i in range(piece['coords'][0] + 1, 8):
            for j in range(piece['coords'][1] - 1, -1, -1):
                coords = [i, j]
                hasPiece = self.has_piece(coords)
                if hasPiece == 2:
                    break
                elif hasPiece == 1:
                    path.append(coords)
                    break
                else:
                    path.append(coords)
        paths.append(path)

        log.info('Queen paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return


    def get_white_king_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible white king move paths """
        log.debug('Getting king paths')

        paths = []

        # North
        coords = [piece['coords'][0] - 1, piece['coords'][1]]
        if self.is_on_board(coords):
            hasPiece = self.has_piece(coords)
            if not hasPiece == 1:
                paths.append([coords])

        log.info('King paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return

    
    def get_black_king_moves(self, piece: PieceDict) -> "list[list[list[int, int]]]" or None:
        """ Get all possible black king move paths """
        log.debug('Getting king paths')

        paths = []

        log.info('King paths for piece generated.')
        log.info('Piece:')
        log.info(piece)
        log.info('Paths:')
        log.info(paths)
        return


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
                'team': 1,
                'coords': coords
            }

        else:
            return None

    
    def has_piece(self, coords):
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

        if coords[0] < 0 or coords[0] > 7 or coords[1] < 0 or coords[1] > 7:
            return False
        else:
            return True
    # End Game state getters


    # Data getters / state logger / print
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


    def log_state(self):
        """ Log Chess state to file """
        
        log.info('white:')
        for rank in self.white:
            log.info(rank)

        log.info('black:')
        for rank in self.black:
            log.info(rank)

        log.info('history:')
        log.info(self.history)

        log.info('castle:')
        log.info(self.castle)

        return


    def to_json(self):
        """ Convert to json serializable object """
        log.debug('Converting Chess to JSON')

        return {
            "white": self.white,
            "black": self.black,
            "history": self.history,
            "castle": self.castle
        }
    # End data getters / print