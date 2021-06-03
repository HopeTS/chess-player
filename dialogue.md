# 5/31/21

### Chess requirements
-   Make preliminary turn, to see if any king puts itself in check
-   Generate valid moves based on type of piece and position of other pieces
-   Check if can castle
-   Check if preliminary turn gets king out of check
-   Check if preliminary turn makes checkmate

#### notes
-   Make piece functions accept myPieces and otherPieces arguments, not white/black so you don't have to write every function twice

-   Game (game.py)

    -   Be able to return board state of current turn
        -   Is white/black in check?
        -   Is white/black checkmated?
        -   Get possible moves for each piece
    
    -   Be able to make a move (one set of coordinates to the next)
        -   Validate the move
            -   Is team in check? If so, does this take them out of check?
            -   Does this move put team in check or checkmate?
            -   (Rook and King) is this move a castle? If so, can team castle?

    -   Set valid moves of each piece based on the game state
        -   Includes castle, en passant, etc.
        -   Trim list of piece's possible moves based on state of the game

    -   Run turn for turn, determine whos turn it is
        -   step 1: whos turn is it? (can't move black on white turn or white on black turn)
        -   step 2: is the move legal? (shut down if not)
        -   step 3: did the move capture a piece?
        -   step 4: did the move create check or checkmate? (shut down if check or checkmate on own team)

    -   Functions:
        -   Reset board
        -   Next turn (move coords)
            -   Validate move
            -   Validate/update game state (check, castle, checkmate, etc.)
            -   Update valid moves of all pieces
            -   Execute move
            -   Update game state (nextState = state)

    -   Interface (as if playing game):
        -   start() initialize board
        -   next_turn(pieceCoords, moveCoords) <- white/black player POST their turn (return True or False)
        -   is_won()
        -   next_turn()
        -   ...
        -   game_over() <- deletes game (Flask)



-   Pieces (.pieces.*.py)

    -   By the end of each turn must have
        -   white (true/false is white piece)
        -   validMoves
        -   moveCount

    -   Get list of all possible moves on the board assuming the board is empty
    -   Update list of valid moves (subset of possible moves, determined by game)
    -   Piece value

### Technical debt
-   No logs :(
    -   Private class methods

-   Do I put all the logic of validating moves in the pieces? Then I would have to send the list of pieces to each piece each time I want to update its valid moves.

-   I need to check in the game (game.py for instances of putting yourself in check or failing to get out of it. I am also going to set limits to possible moves in game.py because it would be faster. I won't limit possible moves that put yourself in check or fail to get you out of it for now, with this structure it would go slow if I made those checks preemptively)

-   If I make each piece a ruleset instead of classes, I could put all the valid move logic in one place

-   If I put all the logic for moving the pieces in the game, thr logic will be simpler and faster

-   This method will be too slow, the main problem is checking if king is in check. With this method, every turn is going to take hundreds of searches. This is not the worst thing in the world if it is running locally, but it will not scale very well at all.

-   If each piece has a new pathToKing attribute that is an empty array that only populates when a piece has a valid move that can get to the enemy king, then I can create a new list of lists. The main list being all the pieces that can discover a check, and the sublists being the path to the king. 

-   If I pass this list of lists into the pieces, I can check whether or not each move would leave the king in check much faster.

-   I can pass two lists of coordinates into the update_valid_moves function on each of the pieces. This will let me prevent illegal moves in the same logic that creates the valid moves so it will be much simpler.

-   Going about it this way will also help with detecting checkmates, since if the current turn player was just put in check and the total number of valid moves they can make is 0 then there is checkmate.

-   The only logic left to work out is detecting stalemates.

-   What to pass into each piece update_valid_moves:
    
    -   enemy_pieces: list of pieces from other side
    -   friendly_pieces: list of pieces from same side
    -   (If i send entire piece classes I can work out the king and check logic with it)

By the way, I am making sure everything is nice and neat because this is an open source project on github! https://github.com/RobbyB97/chess-player :-)
Getting tired, gonna take a break :-)


# 6/1/21

After some time carefully considering the current issues I face, I worked backwards from the network.

I want the chess player to work by establishing a websocket with two players when they start a game. I want the logic of the game in the server (The Python implementation) to be complete so players cannot cheat by entering illegal moves manually. However, I don't want to send the whole game object from Python (server) to React (client). I want the clients and server to communicate their turns in the chess game solely with moves

ex:

player 1: send game request to player
player 2: accept game request
server: start game (establish websockets)
server: (emit state of game for first turn)
player 1: [0, 2], [0, 4] (<- emit move attempt)
server: (validate move attempt)
server: white: [[int, int]] black: [[int, int]] (emits move to both players) over: False
player 2: [int, int], [int, int]
.....
server: white ..., black ..., over: True

As you can see here, the server doesn't emit anything about the logic of the game (possible check discovery attacks, whether or not can castle, if either king is in check, whether a pawn can move twice or en passant, etc.). 

This is because I want to optimize for lowest network traffic, which means that once the Python (server) implementation of the chess engine is complete, I will have to recreate it in React (client).

If all I am sending for the players is their coordinate move requests, then creating persistent objects for each game of chess might be a mistake. I would have to reinstantiate the chess object every time a move is made then do all the work of setting it up again, which would be needlessly complex. 

Instead, I think the chess engine should be sort of like a finite state machine. Where it is not a class, it is just a function that takes the list of white pieces and the list of black pieces, and returns the state of the game (whether or not king is in check, the valid moves of each piece, etc.)

Should the chess pieces be a class?


### Server

/api
    /chess
        chess.py    <- (the chess finite state machine thing)
        game.py     <- (the logic for validating turns and enforcing game rules)
        /pieces
            pieces.py   <- ABC for pieces (abstract class)
            pawn.py
            rook.py
            knight.py
            bishop.py
            king.py
            queen.py


### Client
> The client has to handle all the same logic as the python engine because that's the only way to handle legal move validation before an event is emitted without sending the legal moves of each piece over the network. However the logic must also be handled in the server, otherwise it will be vulnerable to cheating.

/src
    /chess
        chess.js    <- (the chess finite state machine thing)
        game.js     <- (the logic for validating turns and enforcing game rules)
        /pieces
            pieces.js   <- Pieces abstract class
            pawn.js
            rook.js
            knight.js
            bishop.js
            king.js
            queen.js


chess.js:
-   A function that analyzes a board configuration, and returns data about that state
-   Data:
    -   Is either king currently in check?
    -   Is either king currently in checkmate?
    -   What legal moves can each piece make?

Problem: This is all good, separating the analysis of the current game state and the logic of the turn for turn rules of chess but there are a few edge cases where this might become overly complicated
1.  How can an en passant be detected? Turn for turn it is not overlapping any other piece.
2.  How can a castle be handled?

It looks like the analysis of a game state can't really exist with a single turn, in order to cleanly analyze each turn I have to analyze the transition from the first turn to the next. Imagine a pawn is ready to en passant in one turn, and decides to en passant on its next turn. If I analyze the state of the board on the turn where they became able to en passant, I would register the diagonal movement of the pawn to an empty square as a valid move.

The opponent doesn't realize I can do this, so they move some other piece that doesn't affect this possibility. When I analyze the state of the game in their move, that diagonal movement will still be seen as a valid move.

So when the pawn en passants, the game.py logic will detect that this is a valid move and send the new coordinates of the pawn through the finite state machine chess.py, and chess.py will not see an issue with it. But the piece that it captured will remain, because in each step of this logic I don't see any way to detect and handle an en passant.


One way I can handle this is instead of the finite state machine part (chess.py) accepting a single board state, it should take two board states. The first being before the turn, the second being after. That way I could detect whether or not a pawn could en passant (because I could alter that attribute of that pawn class within chess.py if I was analyzing the act of a turn instead of just the state of the board after the turn.)
This would be a much more resource intensive way of going about it, however with some optimization for validating legal moves and king threats and such I should be able to get this to run pretty fast.


Another thing that just crossed my mind is that the server has no need to keep track of whether or not a move is legal, only the client does. This might be the first fundamental difference between the two engines. The client has to know preemptively which moves each player can pick so that when a player picks up a piece off the board to move it, their legal moves can be highlighted green or something, like how chess.com does it.

After giving it some thought I am fairly certain these two slightly different chess engines will have to be made, one for the server and one for the client. This way I can handle something that would be relatively resource intensive and redundant like preemptively getting all legal moves for the player's convenience without dealing with clogging up the server or sending more data than necessary over the websocket.

Also the client engine won't have to actually make the move and reanalyze it, the client engine will be able to assume that the current board position is a legal position. It also won't have to handle data like whether moving here would result in an en passant or would this be a castle. On the client I just take the current state of the game, which is assumed to be true since it was validated and sent by the chess engine on the server, and trim the list of moves. Therefore while the server chess.py may have to take in two states in order to update a turn, the chess.py on the client will only need one. The rammifications of the move are handled on the server only. Validating whether or not the move is a legal one is going to have to be handled by bother server and client.


So, with all that I have learned from this first attempt at a chess engine, it is time to start over.

Gung ho coding like this is typically very bad practice (apparently) however I have no experience with making games and wasn't really sure what to look out for. Since this is mostly just for fun, I felt like instead of looking at how other chess engines are made I'd rather just gung ho it and find my own way.

Since I did it this way and plan on continuing this bushwacking method I expect this is not the last time I start over. But not giving up is skill #1 when it comes to software development! (I can salvage the pieces) Whoops


So theres a metric ton of things to check for in each turn. chess.py is a single file, not enough to hold them all. I think it would be rational to break each function into its own file. But first I have to break each step into a function.

so if the main chess function returns the new state of the game, what if someone attempts to send an invalid move? Realistically with two good faith players this wont happen since you'd have to send a custom server request but never underestimate the willpower of trolls.

If a player sends an invalid move, lets add a new thing to be returned. the main chess function returns:

```python
{
    # Whether or not the move was valid
    valid: bool,

    # Collection of pieces for each team
    # This will have to include
    #   coordinates
    #   enPassant (whether or not piece can en passant for pawns)
    #   type (pawn, rook, etc.)

    newState: {
        "white": [{
            type: str,
            enPassant: bool,
            moveCount: int
        }], 
        "black": [{
            type: str,
            enPassant: bool,
            moveCount: int
        }]
    }
}
```

Then, if the move is valid, it is emmitted with the same data. So the front end engine will interface with the back end engine through this data.

#### chess.py (validate move function) requirements:
-   Is this a valid move?
    1.   Can the piece move this way?
        1.  Is it within the limitations of the piece itself?
            1.  If it is a legal move, I need a list of coordinates denoting the path the unit takes, with the last element in the list being where the piece would move to. This will help answer the other questions without running another heavy search. Python is slow enough with optimized algorithms :-)
        2.  Does this move overlap or (if not a knight) cross over friendly units?
            1.  Cross reference the coordinates of every friendly unit with all the coordinates returned from is it a legal move (if not a knight)
            2.  If a knight, take the single element from the list returned from is it a legal move and compare it to the coordinates of friendly units
        3.  Does this move cross over enemy units?
            1.  If not a knight cross reference the coordinates of every enemy unit with all the coordinates returned from is it a legal move, except for the last one.
    2.   If it can and the moving side was not in check, does this move put it in check?
    3.   If it can and the moving side was in check, does this move take them out of check?
        1.  These can be minimized to will I be in check at the end of this turn? I can analyze the legal moves of all the enemy pieces in order to determine this.
    4.   If this move is valid so far, does the move capture a piece?
        1.  Is this an en passant?
    5.   Is this move a castle?
    6.   Is this move checkmate? Does this move put the enemy in check, and leave them with no legal moves?
-   If it is a valid move, return valid: True and the new state
-   Else, return it is an invalid move and the old state as the new state


I have to go for now but I'll be back on soon. There are a lot of specific edge cases I have to mull over :-)

The pieces will have to be classes, because there a common functions I need for all of them that act differently according to the type. However, I just need to add a get() function to them that returns only the information to communicate between server and client

The piece abstract class
```python
class Piece(ABC):

    def __init__(self, moveCount, enPassant, coords):
        self.coords = coords
        self.moveCount = moveCount
        self.enPassant = enPassant
        return


    @abstractmethod
    def get_paths(self):
        """ Returns all possible paths as a list of lists """
        
        paths = []
        return paths


    def get(self):
        """ Returns information about piece to travel across network """

        return {
            "type": self.type,
            "coords": self.coords
        }


    def move_piece(self, coords):
        """ Moves piece to coords """

        # Override with pawn for handling en passant
        self.moveCount += 1
        pass
```

When chess.py populates the board, it just takes the information about the pieces and uses their type to initialize the class then when chess.py returns it returns the pieces as a result of piece.get(), which is the same format that the front end will send piece information in.

For step 1.1, chess.py runs piece.get_paths() and checks if the coordinates are within one of the paths

For step 1.2, chess.py runs self.check_friendly_collision(self, piece) to check if any of the pieces paths connect with a friendly unit. This is a function of the game to trim the piece's path, not a function of the piece itself.

The way the game will handle moving the piece
```python
class Chess:

    def __init__(self, friendlyTeam, enemyTeam):
        self.friendlyTeam = [] # list of friendly pieces (including king)
        self.enemyTeam = [] # list of enemy pieces (including king)
        for coords in friendlyTeam:
            initialize_piece_and_append_to_friendlyTeam # pseudo
        
        for coords in enemyTeam:
            initialize_piece_and_append_to_enemyTeam # pseudo


    def get_friendly_king(self):
        return index_of_friendly_king # pseudo


    def get_enemy_king(self):
        return index_of_enemy_king # pseudo


    def check_move(coords, moveCoords):
        piece = get_piece_from_coords   #psuedo
        paths = piece.get_paths()
        possiblePath = None
        
        # step 1.1
        for path in paths:
            for tmpCoords in path:

                # If moveCoords found in valid path
                if tmpCoords == moveCoords:
                    possiblePath = path
                    trim_rest_of_coords_past_this_index_out_of_moveToPath # pseudo

        # if moveCoords not in possible paths:
        if (not possiblePath):
            return False

        # step 1.2
        for tmpCoords in possiblePath:
            for piece in friendlyTeam:
                if piece.coords == tmpCoords:
                    if ()
                    trim_rest_of_coords_out_of_path_including_this_index # pseudo
                    break

            # step 1.3
            if not last index: # pseudo
                for piece in enemyTeam:
                    if piece.coords == tmpCoords:
                        trim_rest_of_coords_out_of_path_after_this_index # pseudo
                        break

        if (moveCoords not in possiblePath): # if trying to move past other piece
            return False
```

Thinking.... 🤔

Time to take a break!


Card games like yugioh have multiple steps to each turn. Maybe I need to take a similar approach in dealing with each chess

Chess turn steps:
-   premove_step: step 1
-   move_step: steps 2 and 3
-   postmove_step: steps 4 5 and 6

-   Two states for the turn:
    -   initialState
    -   turnState


# 6/2/21
I started implementing the new approach off stream, but now that the skeleton is there and I'm testing, it's time for the bug hunt to commence. I am testing out the features by altering the function in the /start endpoint, which I am fetching on the React homepage.

Right now I am trying to get the chess board to print an ascii state of the board when I request the /start endpoint

Subclasses have been giving lots of strange errors. It says missing white positional argument but it is explicitly there so I'm not sure what that's about.

The pawns seem to be working and are initialized exactly the same as rooks. Both are subclasses of the same piece ABC, so this is very confusing. Not quite sure where to look right now.

Stupid syntax error lol. So now I have the board successfully starting up a new game state. This indicates that all the base functions of the Piece superclass are working properly.

The only thing is I am designing this to move top down, not left to right. The fact that it prints like this is probably going to lead to some confusion down the road. However if I keep in mind that the logic of [row, col] is consistent throughout the project it should not prove to be an issue.

I think now it's time to get this basic data moving between the server and the client.



So right now, I have established a standard for client to server communication. I will send each teams pieces and their data between the client and server. Both the client and the server will have their own chess board engine and deal with the logic of the pieces on themselves.

This means more typing for me, but less network traffic. One of the things you learn as you grow as a developer is that you need to figure out what to optimize for, and build around that.

A decent developer can build a live streaming app that takes up like 4gb of ram per stream and an additional 2gb per viewer, but a great developer drops those numbers down to megabytes. In the real world, that is the difference between making $100,000 a month and losing $100,000 a month because resources cost money.

Since everyone has a grade A smartphone in hand, I am optimizing for as little network traffic as possible and only just enough logic on the server to prevent cheating, but everything else is being computed on the end device. So it may sound dumb to create two separate chess engines, but I am optimizing for something specific

Also pretend I am writing tests. You should I am just testing the dummy way because this is just a for fun project.

So when I refresh the page and get all this data in the console

that is because in the page, I am requesting the /start endpoint, which creates the board and returns the data


### Rumley

So JavaScript is an interpreted JIT compiled language. This means the computer is basically like 'ok you have a javascript file? send it over and I will start executing immediately. If this code is broken, I will just blow up and all your clients money will die and you bad developer. I don't compile the code before I run it, I just wing it so you better have crossed your ts and shit.'

This is not bad for small things, but when you are working on enterprise grade software this can be extremely dangerous. (i will answer your question it just requires context)

So javascript is weakly typed. This means the following is perfectly legal in javascript

```javascript

let x = 1

console.log(x + 'a')
```

here x is an int (number) and a is a string. In a compiled language, making a mistake like this would throw an error. In Javascript, this would not recognize an error and just log '1a'

So imagine you have a huge database of users, and you change the structure of the User accounts in the backend. You would have to go in the front end, look for as many errors this would throw as you can, throw it in production and pray to god you didnt miss anything. This costs dozens of hours to the developers and usually they don't find all the issues anyway.

These runtime errors, things that the computer doesn't detect until you have dozens of belligerent karens emailing you, are borderline deal breaking when you are choosing a language for enterprise software.

What if JavaScript could detect all these things? Like straight up let you know every instance where something could go wrong, and wont even compile unless you fixed every one?

Enter typescript. TypeScript is a super set of javascript, that allows for strong typing and a really powerful compiler that points out where all your errors are.

So take that database issue from the javascript example. If it was a typescript project, you would just change the user 'interface', or the format for the user structure. Then, typescript would tell you every single instance of the old user structure that you have to change throughout your whole codebase. You save hours upon hours of time and barely anything can go wrong, at least compared to the shithole of type errors you encounter with enterprise level javascript codebases.

I will be back in a minute, let me know if you have any other questions and I'll try to answer

ok, so now I am going to try to simulate a move in the front end, and see how the back end reacts. as of right now, I don't think the back end will do anything since I didn't reimplement the logic yet. The following might be a bit confusing, since I will have to use promise chaining. 

So when you are dealing with data over the network, it doesn't come back to you instantly. But the functions all run near instantly. So how do you wait to get the data back?

Two options: asynchronous functions and promise chaining. The most modern implementations of javascript allow for just asynchronous (async/await) functions, but I am not compiling to the most modern version of javascript since not every browser has it working yet.

I am going with the second option, promise chaining. example: