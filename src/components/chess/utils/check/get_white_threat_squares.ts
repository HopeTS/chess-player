import { coord, IChessPieceData, IClientChessState, movePath } from "../../../../types";
import { is_on_board } from "../is_on_board";
import { get_white_pieces } from "../pieces/get_white_pieces";
import { possible_paths, valid_moves } from "../utils";

/** Get all blank squares white pieces threaten */
export function get_white_threat_squares(chessState: IClientChessState): coord[] {
    const threatSquares: coord[] = [];
    const whitePieces: IChessPieceData[] = get_white_pieces(chessState);

    // Separate pawns, king and other pieces
    let whiteNormalPieces: IChessPieceData[] = [];
    let whitePawnPieces: IChessPieceData[] = [];
    let whiteKingPiece: coord = [0, 0]; // This will always be overridden
    for (let i = 0; i < whitePieces.length; i++) {
        if (whitePieces[i].piece === 1) whitePawnPieces.push(whitePieces[i]);
        else if (whitePieces[i].piece === 6) whiteKingPiece = whitePieces[i].coords;
        else whiteNormalPieces.push(whitePieces[i]);
    }

    // Push valid move coordinates of normal pieces
    for (let i = 0; i < whiteNormalPieces.length; i++) {
        const pieceValidMoves = valid_moves.get(chessState, whiteNormalPieces[i].coords);
        for (let j = 0; j < pieceValidMoves.length; j++) {
            threatSquares.push(pieceValidMoves[j]);
        }
    }

    // Push capture coordinates of pawn pieces
    for (let i = 0; i < whitePawnPieces.length; i++) {
        const leftCapture: coord = [whitePawnPieces[i].coords[0] - 1, whitePawnPieces[i].coords[1] - 1];
        const rightCapture: coord = [whitePawnPieces[i].coords[0] - 1, whitePawnPieces[i].coords[1] + 1];
        if (is_on_board(leftCapture)) threatSquares.push(leftCapture);
        if (is_on_board(rightCapture)) threatSquares.push(rightCapture);
    }

    // Push move coordinates of white king
    const whiteKingPaths: movePath[] = possible_paths.king(whiteKingPiece);
    for (let i = 0; i < whiteKingPaths.length; i++) {
        if (is_on_board(whiteKingPaths[i][0])) threatSquares.push(whiteKingPaths[i][0]);
    }
    return threatSquares;
}
