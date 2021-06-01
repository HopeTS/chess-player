from .piece import Piece


class Bishop(Piece):


    def __init__(self, coords: "list[int, int]" = [5, 5]):
        super().__init__(self)
        
        self.coords = coords
        self.type = 'bishop'
        self.update_valid_moves()
        return


    def get_possible_moves(self):

        newCoordinates = []
        
        # Northeast
        newRow = self.coords[0] + 1
        newCol = self.coords[1] + 1
        while (self.move_is_on_board([newRow, newCol])):
            newCoordinates.append([newRow, newCol])
            newRow += 1
            newCol += 1

        # Northwest
        newRow = self.coords[0] - 1
        newCol = self.coords[1] + 1
        while (self.move_is_on_board([newRow, newCol])):
            newCoordinates.append([newRow, newCol])
            newRow -= 1
            newCol += 1

        # Southeast
        newRow = self.coords[0] + 1
        newCol = self.coords[1] - 1
        while (self.move_is_on_board([newRow, newCol])):
            newCoordinates.append([newRow, newCol])
            newRow += 1
            newCol -= 1

        # Southwest
        newRow = self.coords[0] - 1
        newCol = self.coords[1] - 1
        while (self.move_is_on_board([newRow, newCol])):
            newCoordinates.append([newRow, newCol])
            newRow -= 1
            newCol -= 1 
        return