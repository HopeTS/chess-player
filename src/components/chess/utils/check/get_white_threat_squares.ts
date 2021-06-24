import { coord, IChessPieceData, IClientChessState } from "../../../../types";
import { get_white_pieces } from "../pieces/get_white_pieces";
import { valid_moves } from "../utils";

/** Get all blank squares white pieces threaten */
export function get_white_threat_squares(chessState: IClientChessState): coord[] {
    const threatSquares: coord[] = [];
    const whitePieces: IChessPieceData[] = get_white_pieces(chessState);

    // Separate white pawn and non pawn pieces
    let whiteNonPawnPieces: IChessPieceData[] = [];
    let whitePawnPieces: IChessPieceData[] = [];

    // Get valid move coordinates of all white pieces
    for (let i = 0; i < whitePieces.length; i++) {
        const pieceValidMoves = valid_moves.get(chessState, whitePieces[i].coords);
        for (let j = 0; j < pieceValidMoves.length; j++) {
            threatSquares.push(pieceValidMoves[j]);
        }
    }

    // TODO: Manage pawns
    return threatSquares;
}
