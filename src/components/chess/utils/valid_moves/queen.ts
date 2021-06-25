import { coord, IChessPieceData, IClientChessState, movePath } from "../../../../types";
import { get_pinned_piece_data } from "../check/get_pinned_piece_data";
import * as possible from "../possible_paths/possible_paths";
import { strip_moves_outside_pin_path } from "./strip_moves_outside_pin_path";

/** Get all valid moves of a queen given the state of the chess board */
export function queen(chessState: IClientChessState, piece: IChessPieceData): coord[] {
    let validMoves: coord[] = [];
    const possiblePaths = possible.queen(piece.coords);

    // Create relative board variables
    const sameTeam = piece.team === 0 ? chessState.white : chessState.black;
    const otherTeam = piece.team === 0 ? chessState.black : chessState.white;

    // Iterate through each path to trim out invalid moves
    for (let i = 0; i < possiblePaths.length; i++) {
        for (let j = 0; j < possiblePaths[i].length; j++) {
            const currentCoords = possiblePaths[i][j];

            // If a piece on the same team occupies the coords
            if (sameTeam[currentCoords[0]][currentCoords[1]] !== 0) {
                break;
            }

            // If a piece on the other team occupies the coords
            else if (otherTeam[currentCoords[0]][currentCoords[1]] !== 0) {
                validMoves.push(currentCoords);
                break;
            }

            // If the coords are blank
            else validMoves.push(currentCoords);
        }
    }

    // Check if piece is pinned, and remove invalid removes
    const pinnedPiece = get_pinned_piece_data(chessState, piece);
    if (!pinnedPiece) return validMoves;
    validMoves = strip_moves_outside_pin_path(validMoves, pinnedPiece);
    return validMoves;
}
