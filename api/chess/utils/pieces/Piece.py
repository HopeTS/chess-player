from abc import ABC, abstractmethod 


class Piece(ABC):
    """ Template object for pieces """

    def __init__(self, coords: "list[int, int]", white: bool, moveCount: int = 0):
        """ Set up initial piece attributes """
        
        self.coords = coords
        self.moveCount = moveCount
        self.white = white
        return


    @abstractmethod
    def get_paths(self):
        """ Returns all possible paths as a list of lists """
        
        pass


    def is_in_path(self, coords):
        """ 
        Check if coordinates are in valid path.\n
        If so, return path from piece to coordinates 
        """

        try:
            for path in self.get_paths():
                currentPath = []
                for tmpCoords in path:
                    currentPath.append(tmpCoords)
                    if tmpCoords == coords:
                        return currentPath
            return None

        except:
            return None


    def is_on_board(self, coords):
        """ Check if coordinates are on board """

        return (
            (coords[0] >= 0 and coords[0] <= 7) and
            (coords[1] >= 0 and coords[1] <= 7)
        )


    def get(self):
        """ Returns data about the piece """

        return {
            "type": self.type,
            "coords": self.coords,
            "moveCount": self.moveCount,
            "white": self.white
        }


    def move_piece(self, coords):
        """ Move piece to new coordinates """

        self.coords = coords
        self.moveCount += 1
        return