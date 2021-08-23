import { coord, IClientChessState, IChessPieceData } from "../../../../types";
import { get_black_check_pieces } from "../check/get_black_check_pieces";
import { get_black_check_status } from "../check/get_black_check_status";
import { get_pinned_piece_data } from "../check/get_pinned_piece_data";
import { get_white_check_pieces } from "../check/get_white_check_pieces";
import { get_white_check_status } from "../check/get_white_check_status";
import { coords_match } from "../coords_match";
import { get_king } from "../pieces/get_king";
import * as possible from "../possible_paths/possible_paths";
import { strip_moves_outside_pin_path } from "./strip_moves_outside_pin_path";

/** Get all valid moves of a bishop given the state of the chess board */
export function bishop(chessState: IClientChessState, piece: IChessPieceData): coord[] {
    let validMoves: coord[] = [];
    const possiblePaths = possible.bishop(piece.coords);

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

    // Check if piece is pinned, and remove invalid moves
    const pinnedPiece = get_pinned_piece_data(chessState, piece);
    if (pinnedPiece) validMoves = strip_moves_outside_pin_path(validMoves, pinnedPiece);


    // Handle if king is in check (white)
    if (piece.team === 0 && get_white_check_status(chessState)) {
        console.log('king in check')
        const checkPieces = get_white_check_pieces(chessState);
        const whiteKing = get_king(chessState.white)
        if (!checkPieces) return validMoves;    // Should never happen

        // Trim moves that aren't in checkPaths
        for (let i = 0; i < validMoves.length; i++) {
            // Ensure that move satisfies check condition of every piece threatening the king
            let satisfiedCheckNum = 0;
            for (let j = 0; j < checkPieces.length; j++) {
                // If move can capture checking piece
                if (coords_match(checkPieces[i].checkedPiece.coords, validMoves[i])) {
                    satisfiedCheckNum += 1;
                    console.log(`move in way ${validMoves[i]}`)
                    continue;
                }

                // If move can get between checking piece and king
                for (let k = 0; k < checkPieces[i].pathThroughKing.length; k++) {
                    const cmpCoords = checkPieces[i].pathThroughKing[k]
                    if (coords_match(whiteKing, cmpCoords)) {
                        satisfiedCheckNum += 1;
                        break;
                    }
                }
            }

            // If satisfiesCheckNum < checkPieces.length, not all conditions are met
            if (!(satisfiedCheckNum === checkPieces.length)) validMoves.splice(i, 1)
        }
    }

    // Handle if king is in check (black)
    if (piece.team === 1 && get_black_check_status(chessState)) {
        const checkPieces = get_black_check_pieces(chessState);
        const blackKing = get_king(chessState.black)
        if (!checkPieces) return validMoves;    // Should never happen

        // Trim moves that aren't in checkPaths
        for (let i = 0; i < validMoves.length; i++) {
            // Ensure that move satisfies check condition of every piece threatening the king
            let satisfiedCheckNum = 0;
            for (let j = 0; j < checkPieces.length; j++) {
                // If move can capture checking piece
                if (coords_match(checkPieces[i].checkedPiece.coords, validMoves[i])) {
                    satisfiedCheckNum += 1;
                    continue;
                }

                // If move can get between checking piece and king
                for (let k = 0; k < checkPieces[i].pathThroughKing.length; k++) {
                    const cmpCoords = checkPieces[i].pathThroughKing[k]
                    if (coords_match(blackKing, cmpCoords)) {
                        satisfiedCheckNum += 1;
                        break;
                    }
                }
            }

            // If satisfiesCheckNum < checkPieces.length, not all conditions are met
            if (!(satisfiedCheckNum === checkPieces.length)) validMoves.splice(i, 1)
        }
    }

    return validMoves;
}
