import { IChessPieceData, IClientChessState, coord } from "../../../../types";
import { get_white_pieces } from "../pieces/get_white_pieces";
import * as valid_moves from "../valid_moves/valid_moves";
import { get_white_threat_squares } from "./get_white_threat_squares";

/** Check if black king is in check */
export function get_black_check_status(chessState: IClientChessState): boolean {
    let kingCoords: coord | null = null;
    const whiteValidMoves: coord[] = get_white_threat_squares(chessState);

    // Get coordinates of the black king
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (chessState.black[i][j] === 6) kingCoords = [i, j];
        }
    }
    if (!kingCoords) return false;

    // Check for black king coordinates in white valid moves
    for (let i = 0; i < whiteValidMoves.length; i++) {
        if (whiteValidMoves[i][0] === kingCoords[0] && whiteValidMoves[i][1] === kingCoords[1]) return true;
    }

    return false;
}
