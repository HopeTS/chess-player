/** Coordinates */
export type coord = [number, number];

/** Chess move */
export type move = [coord, coord];

/** Chess piece (0:blank, 1:pawn, 2:rook, 3:knight, 4:bishop, 5:queen, 6:king) */
export type piece = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Chess team (0:white, 1:black) */
export type team = 0 | 1;

/** Chess board */
export type board = [
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece],
    [piece, piece, piece, piece, piece, piece, piece, piece]
];

/** State of chess game (sent over the network) */
export interface IServerChessState {

    /** White team board */
    white: board;

    /** Black team board */
    black: board;

    /** Move history (list of moveFrom - moveTo coordinates) */
    history: [move?];

    /** Castle eligibility */
    castle: [
        [boolean, boolean, boolean]?,
        [boolean, boolean, boolean]?
    ]
}


/** State of chess game (handled Client side) */
export interface IClientChessState extends IServerChessState {

    /** Is white in check */
    whiteCheck?: boolean;

    /** Is black in check */
    blackCheck?: boolean;

    /** Is white in checkmate */
    whiteCheckMate?: boolean;

    /** Is black in checkmate */
    blackCheckMate?: boolean;
}


/** Chess Move coordinate (handled Client side) */
export interface IClientChessMove {
    from: coord;
    to: coord;
}

/** Chess Square */
export interface IChessSquare {
    coords: coord;
    chessState: IClientChessState;
}

/** Chess piece */
export interface IChessPiece {

    piece: piece;
    team: team;
}