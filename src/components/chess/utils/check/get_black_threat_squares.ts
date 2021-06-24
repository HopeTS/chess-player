import { coord, IChessPieceData, IClientChessState } from "../../../../types";
import { get_black_pieces } from "../pieces/get_black_pieces";
import { valid_moves } from "../utils";

/** Get all blank squares black pieces threaten */
export function get_black_threat_squares(chessState: IClientChessState): coord[] {
    const threatSquares: coord[] = [];
    const blackPieces: IChessPieceData[] = get_black_pieces(chessState);

    // Get valid move coordinates of all white pieces
    for (let i = 0; i < blackPieces.length; i++) {
        const pieceValidMoves = valid_moves.get(chessState, blackPieces[i].coords);
        for (let j = 0; j < pieceValidMoves.length; j++) {
            threatSquares.push(pieceValidMoves[j]);
        }
    }
    return threatSquares;
}
