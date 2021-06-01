from .piece import Piece


class Queen(Piece):


    def __init__(self, coords: "list[int, int]" = [5, 5]):
        super().__init__(self)
        
        self.coords = coords
        self.type = 'queen'
        return


    def update_valid_moves(self, enemyTeam, sameTeam):
        
        # Get team coords
        sameKing = None
        enemyKing = None
        sameTeamCoords = []
        enemyTeamCoords = []
        kingThreats = []

        for piece in enemyTeam:
            if (piece.kingThreat):
                kingThreats.append(piece.kingThreat)

        for piece in enemyTeam:
            if piece.type == 'king':
                enemyKing = piece
            sameTeamCoords.append(piece.coords)

        for piece in sameTeam:
            if piece.type == 'king':
                sameKing = piece
            enemyTeamCoords.append(piece.coords)

        validMoves = []
        enemyKingThreat = []

        # Northeast
        stopped = False # flag for if piece is stopped by another piece
        newRow = self.coords[0] + 1
        newCol = self.coords[1] + 1
        while (self.move_is_on_board([newRow, newCol])):

            # Check for check
            for threat in kingThreats:
                for coord in threat:
            
            # Check for friendly units
            for coords in sameTeamCoords:
                if coords == [newRow, newCol]:
                    stopped = True


            validMoves.append([newRow, newCol])

            # Check for enemy units
            for coords in enemyTeamCoords:
                if coords == [newRow, newCol]:
                    stopped = True

            newRow += 1
            newCol += 1

        # Northwest
        stopped = False # flag for if piece is stopped by another piece
        newRow = self.coords[0] - 1
        newCol = self.coords[1] + 1
        while (self.move_is_on_board([newRow, newCol])):
            validMoves.append([newRow, newCol])
            newRow -= 1
            newCol += 1

        # Southeast
        stopped = False # flag for if piece is stopped by another piece
        newRow = self.coords[0] + 1
        newCol = self.coords[1] - 1
        while (self.move_is_on_board([newRow, newCol])):
            validMoves.append([newRow, newCol])
            newRow += 1
            newCol -= 1

        # Southwest
        stopped = False # flag for if piece is stopped by another piece
        newRow = self.coords[0] - 1
        newCol = self.coords[1] - 1
        while (self.move_is_on_board([newRow, newCol])):
            validMoves.append([newRow, newCol])
            newRow -= 1
            newCol -= 1 

        # North
        stopped = False # flag for if piece is stopped by another piece
        newCol = self.coord[1] + 1
        while self.move_is_on_board([self.coords[0], newCol]):
            validMoves.append[self.coords[0], newCol]
            newCol += 1

        # South
        stopped = False # flag for if piece is stopped by another piece
        for i in range(self.coords[1] -1, -1):

            # Check for friendly piece
            for piece in sameTeamCoords:
                if [self.coords[0], i] == piece:
                    stopped = True

            # Check for king threat
             
            
            if not stopped:
                validMoves.append[self.coords[0], i]
        
        # East
        stopped = False # flag for if piece is stopped by another piece
        for i in range(8):
            if (i != self.coords[0]):
                validMoves.append[i, self.coords[1]]

        # West
        stopped = False # flag for if piece is stopped by another piece
        for i in range(8):
            if (i != self.coords[0]):
                validMoves.append[i, self.coords[1]]


        # Update valid moves and king threat
        self.validMoves = validMoves
        self.kingThreat = kingThreat

        return