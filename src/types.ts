import React from "react";

/** Coordinates */
export type coord = [number, number];

/** Chess move */
export type move = [coord, coord];

/** Chess move path */
export type movePath = coord[];

/** Chess piece (0:blank, 1:pawn, 2:rook, 3:knight, 4:bishop, 5:queen, 6:king) */
export type piece = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Chess team (0:white, 1:black) */
export type team = 0 | 1;

/** Castle state */
export type castle = [[boolean, boolean, boolean], [boolean, boolean, boolean]];

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
    history: move[];

    /** Castle eligibility */
    castle: castle;
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
    validMoves: coord[];
    fromCoords: coord | null;

    /** Select piece (pass down from board to piece) */
    select_piece: () => void;

    /** Cancel move (pass down from board to piece) */
    cancel_move: () => void;
}

/** Chess piece data */
export interface IChessPieceData {
    piece: piece;
    team: team;
    coords: coord
}

/** Chess piece component */
export interface IChessPiece {
    piece: piece;
    team: team;
    fromCoords: IChessSquare['fromCoords'];
    coords: coord;

    /** Select piece */
    select_piece: () => void;

    /** Cancel move */
    cancel_move: () => void;
}

/** Check status */
export interface IChessCheckStatus {
    white: boolean;
    black: boolean;
}

/** Selected piece component */
export interface ISelectedPiece {
    piece: piece;
    team?: team;
}

/** Pinned piece data */
export interface IPinnedPiece {
    pinnedPiece: IChessPieceData;
    pinningPiece: IChessPieceData;
    pathToKing: movePath;
}

/** Chess Board component */
export interface IChessBoard {
    dev?: boolean;
}

/** Chess Board Dev Panel component */
export interface IChessBoardDevPanel {
    chessState: IClientChessState;
    handle_start_game: () => void;
}