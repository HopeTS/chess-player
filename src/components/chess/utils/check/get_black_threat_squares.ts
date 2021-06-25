import { coord, IChessPieceData, IClientChessState, movePath } from "../../../../types";
import { is_on_board } from "../is_on_board";
import { get_black_pieces } from "../pieces/get_black_pieces";
import { possible_paths, valid_moves } from "../utils";

/** Get all blank squares black pieces threaten */
export function get_black_threat_squares(chessState: IClientChessState): coord[] {
    const threatSquares: coord[] = [];
    const blackPieces: IChessPieceData[] = get_black_pieces(chessState);

    // Separate pawns, king and other pieces
    let blackNonPawnPieces: IChessPieceData[] = [];
    let blackPawnPieces: IChessPieceData[] = [];
    let blackKingPiece: coord = [0, 0]; // This will always be overridden
    for (let i = 0; i < blackPieces.length; i++) {
        if (blackPieces[i].piece === 1) blackPawnPieces.push(blackPieces[i]);
        else if (blackPieces[i].piece === 6) blackKingPiece = blackPieces[i].coords;
        else blackNonPawnPieces.push(blackPieces[i]);
    }

    // Push valid move coordinates of normal pieces
    for (let i = 0; i < blackNonPawnPieces.length; i++) {
        const pieceValidMoves = valid_moves.get(chessState, blackNonPawnPieces[i].coords);
        for (let j = 0; j < pieceValidMoves.length; j++) {
            threatSquares.push(pieceValidMoves[j]);
        }
    }

    // Push capture coordinates of pawn pieces
    for (let i = 0; i < blackPawnPieces.length; i++) {
        const leftCapture: coord = [blackPawnPieces[i].coords[0] + 1, blackPawnPieces[i].coords[1] - 1];
        const rightCapture: coord = [blackPawnPieces[i].coords[0] + 1, blackPawnPieces[i].coords[1] + 1];
        if (is_on_board(leftCapture)) threatSquares.push(leftCapture);
        if (is_on_board(rightCapture)) threatSquares.push(rightCapture);
    }

    // Push move coordinates of black king
    const blackKingPaths: movePath[] = possible_paths.king(blackKingPiece);
    for (let i = 0; i < blackKingPaths.length; i++) {
        if (is_on_board(blackKingPaths[i][0])) threatSquares.push(blackKingPaths[i][0]);
    }
    return threatSquares;
}
