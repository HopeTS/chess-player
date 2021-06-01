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

Since I did it this way and plan on continuing this bushwacking method I expect this is not the last time I start over. But not giving up is skill #1 when it comes to software development! (I can salvage the pieces)