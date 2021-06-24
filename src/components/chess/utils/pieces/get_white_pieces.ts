import { IChessPieceData, IClientChessState, coord } from "../../../../types";
import { get_piece } from "./get_piece";

/** Get piece data of all white pieces */
export function get_white_pieces(chessState: IClientChessState): IChessPieceData[] {
    let pieces: IChessPieceData[] = [];
    let pieceCoords: coord[] = [];

    // Get all piece coordinates
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (chessState.white[i][j] !== 0) pieceCoords.push([i, j]);
        }
    }

    // Get piece data
    for (let i = 0; i < pieceCoords.length; i++) {
        const piece = get_piece(chessState, pieceCoords[i]);
        piece && pieces.push(piece);
    }
    return pieces;
}
