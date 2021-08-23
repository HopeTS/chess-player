import { coord, ICheckedPiece, IChessPieceData, IClientChessState } from "../../../../types";
import { coords_match } from "../coords_match";
import { get_black_pieces } from "../pieces/get_black_pieces";
import { possible_paths } from "../utils";

/** Get pieces putting white king in check */
export function get_white_check_pieces(chessState: IClientChessState) {
    let checkedPieces: ICheckedPiece[] = [];

    // Find white king
    let whiteKing: coord = [0, 0]; // This will always be overidden
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (chessState.white[i][j] === 6) whiteKing = [i, j];
        }
    }

    // Get pieces
    const blackPieces = get_black_pieces(chessState);

    // Separate pawns
    let blackNonPawnPieces: IChessPieceData[] = [];
    let blackPawnPieces: IChessPieceData[] = [];
    for (let i = 0; i < blackPieces.length; i++) {
        if (blackPieces[i].piece === 1) blackPawnPieces.push(blackPieces[i]);
        else blackNonPawnPieces.push(blackPieces[i]);
    }

    // Check non pawn pieces
    for (let i = 0; i < blackNonPawnPieces.length; i++) {
        const piece = blackNonPawnPieces[i];

        // Check if any of the piece paths intersect with king
        let paths = possible_paths.get(piece);
        for (let j = 0; j < paths.length; j++) {
            const path = paths[j];
            let checkedPath: coord[] = [];
            let kingChecked: number | null = null; // Index of path when king crossed

            // Check if path intersects with king
            for (let k = 0; k < path.length; k++) {
                // Stop running after the next coords in path from crossing king
                if (kingChecked && !(kingChecked <= k - 1)) break;

                // If path intersects with king
                if (coords_match(path[k], whiteKing)) {
                    kingChecked = k;
                    break;
                }

                // If other piece found in path
                else if (chessState.white[path[k][0]][path[k][1]] !== 0) break;
                else if (chessState.black[path[k][0]][path[k][1]] !== 0) break;

                checkedPath.push(path[k]);
            }

            // Construct checkedPiece data if path was king pin
            if (checkedPath.length && kingChecked) {
                // Add CheckedPiece data to checkedPieces
                checkedPieces.push({
                    pathThroughKing: checkedPath,
                    checkedPiece: blackNonPawnPieces[i],
                });
            }
        }
    }

    // Check pawn pieces
    for (let i = 0; i < blackPawnPieces.length; i++) {
        const piece = blackPawnPieces[i];

        // Check pawn capture squares to see if they touch king
        const leftCapture: coord = [piece.coords[0] + 1, piece.coords[1] - 1];
        const rightCapture: coord = [piece.coords[0] + 1, piece.coords[1] + 1];

        if (coords_match(whiteKing, leftCapture)) {
            checkedPieces.push({
                pathThroughKing: [piece.coords, leftCapture],
                checkedPiece: piece,
            });
        } else if (coords_match(whiteKing, rightCapture)) {
            checkedPieces.push({
                pathThroughKing: [piece.coords, rightCapture],
                checkedPiece: piece,
            });
        }
    }

    return checkedPieces;
}
