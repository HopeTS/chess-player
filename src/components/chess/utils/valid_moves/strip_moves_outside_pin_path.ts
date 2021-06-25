import { coord, IPinnedPiece } from "../../../../types";
import { coords_match } from "../coords_match";

/** Remove all moves from validMoves that don't exist in pinPath */
export function strip_moves_outside_pin_path(validMoves: coord[], pinnedPiece: IPinnedPiece) {
    let strippedValidMoves: coord[] = [];

    // Check for validMoves pathToKing matching coords
    for (let i = 0; i < validMoves.length; i++) {
        for (let j = 0; j < pinnedPiece.pathToKing.length; j++) {
            if (coords_match(validMoves[i], pinnedPiece.pathToKing[j])) strippedValidMoves.push(validMoves[i]);
        }

        // Check if piece can take pinningPiece
        if (coords_match(validMoves[i], pinnedPiece.pinningPiece.coords)) strippedValidMoves.push(validMoves[i]);
    }
    return strippedValidMoves;
}
