import { coord, IChessPieceData, IClientChessState } from "../../../../types";
import { get_pinned_piece_data } from "../check/get_pinned_piece_data";
import { has_piece } from "../pieces/has_piece";
import * as possible from "../possible_paths/possible_paths";
import { strip_moves_outside_pin_path } from "./strip_moves_outside_pin_path";

/** Get all valid moves of a knight given the state of the chess board */
export function knight(chessState: IClientChessState, piece: IChessPieceData): coord[] {
    let validMoves: coord[] = [];
    let possiblePaths = possible.knight(piece.coords);

    // Flatten paths array
    let possibleMoves: coord[] = [];
    for (let i = 0; i < possiblePaths.length; i++) {
        for (let j = 0; j < possiblePaths[i].length; j++) {
            possibleMoves.push(possiblePaths[i][j]);
        }
    }

    // Remove moves onto coords occupied by a piece of the same team
    const sameTeam = piece.team === 0 ? chessState.white : chessState.black;
    for (let i = 0; i < possibleMoves.length; i++) {
        if (!has_piece(sameTeam, possibleMoves[i])) validMoves.push(possibleMoves[i]);
    }

    // Check if piece is pinned, and remove invalid removes
    const pinnedPiece = get_pinned_piece_data(chessState, piece);
    if (!pinnedPiece) return validMoves;
    validMoves = strip_moves_outside_pin_path(validMoves, pinnedPiece);
    return validMoves;
}
