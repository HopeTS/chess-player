import { IClientChessState, IPinnedPiece, coord } from "../../../../types";
import { coords_match } from "../coords_match";
import { get_white_pieces } from "../pieces/get_white_pieces";
import { pieces, possible_paths } from "../utils";

/** Get pinned pieces for black team */
export function get_black_pinned_pieces(chessState: IClientChessState): IPinnedPiece[] {
    let pinnedPieces: IPinnedPiece[] = [];

    // Find black king
    let blackKing: coord = [0, 0]; // This will always be overridden
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (chessState.black[i][j] === 6) blackKing = [i, j];
        }
    }

    // Check each white piece
    const whitePieces = get_white_pieces(chessState);
    for (let i = 0; i < whitePieces.length; i++) {
        const piece = whitePieces[i];

        // Check if any of the piece paths intersect with king
        let paths = possible_paths.get(piece);
        for (let j = 0; j < paths.length; j++) {
            const path = paths[j];
            let pinnedPiece: coord | null = null;
            let pinnedPath: coord[] = [];
            let kingPinned = false;

            // Check if path intersects with king
            for (let k = 0; k < path.length; k++) {
                // If path intersects with king
                if (coords_match(path[k], blackKing)) {
                    kingPinned = true;
                    break;
                }

                // If same team's piece found in path
                else if (chessState.black[path[k][0]][path[k][1]] !== 0) {
                    if (pinnedPiece) break;
                    pinnedPiece = path[k];
                }

                // If other team's piece found in path
                else if (chessState.white[path[k][0]][path[k][1]] !== 0) break;

                pinnedPath.push(path[k])
            }

            // Construct pinnedPiece data if path was king pin
            if (pinnedPath.length && kingPinned && pinnedPiece) {
                try {
                    // Construct pin piece data
                    const pinnedPieceData = pieces.get_piece(chessState, pinnedPiece)
                    if (!pinnedPieceData) throw new Error('Invalid piece found')

                    // Add PinnedPiece data to pinnedPieces
                    const pinnedData: IPinnedPiece = {
                        pathToKing: pinnedPath,
                        pinnedPiece: pinnedPieceData,
                        pinningPiece: whitePieces[i]
                    }
                    pinnedPieces.push(pinnedData)
                }

                catch (err) {
                    console.error(err)
                }
            }
        }
    }

    return pinnedPieces;
}
