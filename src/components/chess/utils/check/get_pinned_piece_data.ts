import { IChessPieceData, IClientChessState, IPinnedPiece } from "../../../../types";
import { coords_match } from "../coords_match";
import { get_black_pinned_pieces } from "./get_black_pinned_pieces";
import { get_white_pinned_pieces } from "./get_white_pinned_pieces";

// Return pinnedPiece data if given piece is pinned
export function get_pinned_piece_data(chessState: IClientChessState, piece: IChessPieceData) {
    // Handle white
    if (piece.team === 0) {
        const pinnedPieces = get_white_pinned_pieces(chessState);

        // Check if piece is pinned
        let pinnedData: IPinnedPiece | null = null;
        for (let i = 0; i < pinnedPieces.length; i++) {
            if (coords_match(pinnedPieces[i].pinnedPiece.coords, piece.coords)) {
                pinnedData = pinnedPieces[i];
            }
            break;
        }

        if (pinnedData) return pinnedData
    }

    // Handle black
    else {
        const pinnedPieces = get_black_pinned_pieces(chessState);

        // Check if piece is pinned
        let pinnedData: IPinnedPiece | null = null;
        for (let i = 0; i < pinnedPieces.length; i++) {
            if (coords_match(pinnedPieces[i].pinnedPiece.coords, piece.coords)) {
                pinnedData = pinnedPieces[i];
            }
            break;
        }

        if (pinnedData) return pinnedData
    }

    return null;
}