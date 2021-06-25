import { coord, IChessPieceData, IClientChessState } from "../../../../types";
import { get_piece } from "../pieces/get_piece";
import { bishop } from "./bishop";
import { king } from "./king";
import { knight } from "./knight";
import { pawn } from "./pawn";
import { queen } from "./queen";
import { rook } from "./rook";

/** Get valid moves of a given chess piece */
export function get(chessState: IClientChessState, coords: coord): coord[] {
    let validMoves: coord[] = [];

    try {
        // Get piece data / ensure piece exists
        const piece: IChessPieceData | undefined = get_piece(chessState, coords);
        if (!piece) throw new Error("Piece coordinates empty or invalid");

        // Return valid moves of piece
        switch (piece.piece) {
            case 0:
                throw new Error("There is no piece in given coordinates");
            case 1:
                validMoves = pawn(chessState, piece);
                break;
            case 2:
                validMoves = rook(chessState, piece);
                break;
            case 3:
                validMoves = knight(chessState, piece);
                break;
            case 4:
                validMoves = bishop(chessState, piece);
                break;
            case 5:
                validMoves = queen(chessState, piece);
                break;
            case 6:
                validMoves = king(chessState, piece);
                break;
            default:
                throw new Error("Invalid piece data");
        }
    } catch (err) {
        console.error(err);
    }

    return validMoves;
}
