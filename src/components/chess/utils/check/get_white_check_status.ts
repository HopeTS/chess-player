import { IClientChessState, coord } from "../../../../types";
import { coords_match } from "../coords_match";
import { get_black_threat_squares } from "./get_black_threat_squares";

/** Check if white king is in check */
export function get_white_check_status(chessState: IClientChessState): boolean {
    let kingCoords: coord | null = null;
    const blackValidMoves: coord[] = get_black_threat_squares(chessState);

    // Get coordinates of the white king
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (chessState.white[i][j] === 6) kingCoords = [i, j];
        }
    }
    if (!kingCoords) return false;

    // Check for white king coordinates in white valid moves
    for (let i = 0; i < blackValidMoves.length; i++) {
        if (coords_match(blackValidMoves[i], kingCoords)) return true;
    }

    return false;
}
