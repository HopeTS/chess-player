import { coord, IChessPieceData, IClientChessState, move } from "../../../../types";
import { get_piece } from "../pieces/get_piece";
import { has_piece } from "../pieces/has_piece";
import { is_on_board } from "../is_on_board";

/** Get all valid moves of a pawn given the state of the chess board */
export function pawn(chessState: IClientChessState, piece: IChessPieceData): coord[] {
    let validMoves: coord[] = [];

    // White
    if (piece.team === 0) {
        // Normal move
        let moveCoords: coord = [piece.coords[0] - 1, piece.coords[1]];
        let hasPiece: boolean = false;
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.white, moveCoords) || has_piece(chessState.black, moveCoords);
            if (!hasPiece) validMoves.push(moveCoords);
        }

        // First move
        if (piece.coords[0] === 6) {
            if (validMoves) {
                moveCoords = [piece.coords[0] - 2, piece.coords[1]];
                if (is_on_board(moveCoords)) {
                    hasPiece = has_piece(chessState.white, moveCoords) || has_piece(chessState.black, moveCoords);
                    if (!hasPiece) validMoves.push(moveCoords);
                }

            }
        }

        // Left capture
        moveCoords = [piece.coords[0] - 1, piece.coords[1] - 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.black, moveCoords);
            if (hasPiece) validMoves.push(moveCoords);
        }

        // Right capture
        moveCoords = [piece.coords[0] - 1, piece.coords[1] + 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.black, moveCoords);
            if (hasPiece) validMoves.push(moveCoords);
        }

        // En passant captures
        if (piece.coords[0] === 3) {
            // Left en passant
            moveCoords = [piece.coords[0] - 1, piece.coords[1] - 1];

            if (is_on_board(moveCoords)) {
                // Check if enPassantPiece is a pawn
                const enPassantPiece = get_piece(chessState, [piece.coords[0], piece.coords[1] - 1]);
                if (enPassantPiece?.piece === 1) {
                    // Check if the pawn double moved last turn
                    const enPassantMove: move = [
                        [enPassantPiece.coords[0] - 2, enPassantPiece.coords[1]],
                        enPassantPiece.coords,
                    ];
                    const lastMove = chessState.history[chessState.history.length - 1];
                    if (
                        enPassantMove[0][0] === lastMove[0][0] &&
                        enPassantMove[0][1] === lastMove[0][1] &&
                        enPassantMove[1][0] === lastMove[1][0] &&
                        enPassantMove[1][1] === lastMove[1][1]
                    ) {
                        validMoves.push(moveCoords);
                    }
                }
            }

            // Right en passant
            moveCoords = [piece.coords[0] - 1, piece.coords[1] + 1];

            if (is_on_board(moveCoords)) {
                // Check if enPassantPiece is a pawn
                const enPassantPiece = get_piece(chessState, [piece.coords[0], piece.coords[1] + 1]);
                if (enPassantPiece?.piece === 1) {
                    // Check if the pawn double moved last turn
                    const enPassantMove: move = [
                        [enPassantPiece.coords[0] - 2, enPassantPiece.coords[1]],
                        enPassantPiece.coords,
                    ];
                    const lastMove = chessState.history[chessState.history.length - 1];
                    if (
                        enPassantMove[0][0] === lastMove[0][0] &&
                        enPassantMove[0][1] === lastMove[0][1] &&
                        enPassantMove[1][0] === lastMove[1][0] &&
                        enPassantMove[1][1] === lastMove[1][1]
                    ) {
                        validMoves.push(moveCoords);
                    }
                }
            }
        }
    }

    // Black
    else {
        // Normal move
        let moveCoords: coord = [piece.coords[0] + 1, piece.coords[1]];
        let hasPiece: boolean = false;
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.white, moveCoords) || has_piece(chessState.black, moveCoords);
            if (!hasPiece) validMoves.push(moveCoords);
        }

        // First move
        if (piece.coords[0] === 1) {
            moveCoords = [piece.coords[0] + 2, piece.coords[1]];
            if (is_on_board(moveCoords)) {
                hasPiece = has_piece(chessState.white, moveCoords) || has_piece(chessState.black, moveCoords);
                if (!hasPiece) validMoves.push(moveCoords);
            }
        }

        // Left capture
        moveCoords = [piece.coords[0] + 1, piece.coords[1] - 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.white, moveCoords);
            if (hasPiece) validMoves.push(moveCoords);
        }

        // Right capture
        moveCoords = [piece.coords[0] + 1, piece.coords[1] + 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.white, moveCoords);
            if (hasPiece) validMoves.push(moveCoords);
        }

        // En passant captures
        if (piece.coords[0] === 4) {
            // Left en passant
            moveCoords = [piece.coords[0] + 1, piece.coords[1] - 1];

            if (is_on_board(moveCoords)) {
                // Check if enPassantPiece is a pawn
                const enPassantPiece = get_piece(chessState, [piece.coords[0], piece.coords[1] - 1]);
                if (enPassantPiece?.piece === 1) {
                    // Check if the pawn double moved last turn
                    const enPassantMove: move = [
                        [enPassantPiece.coords[0] + 2, enPassantPiece.coords[1]],
                        enPassantPiece.coords,
                    ];
                    const lastMove = chessState.history[chessState.history.length - 1];
                    if (
                        enPassantMove[0][0] === lastMove[0][0] &&
                        enPassantMove[0][1] === lastMove[0][1] &&
                        enPassantMove[1][0] === lastMove[1][0] &&
                        enPassantMove[1][1] === lastMove[1][1]
                    ) {
                        validMoves.push(moveCoords);
                    }
                }
            }

            // Right en passant
            moveCoords = [piece.coords[0] + 1, piece.coords[1] + 1];

            if (is_on_board(moveCoords)) {
                // Check if enPassantPiece is a pawn
                const enPassantPiece = get_piece(chessState, [piece.coords[0], piece.coords[1] + 1]);
                if (enPassantPiece?.piece === 1) {
                    // Check if the pawn double moved last turn
                    const enPassantMove: move = [
                        [enPassantPiece.coords[0] + 2, enPassantPiece.coords[1]],
                        enPassantPiece.coords,
                    ];
                    const lastMove = chessState.history[chessState.history.length - 1];
                    if (
                        enPassantMove[0][0] === lastMove[0][0] &&
                        enPassantMove[0][1] === lastMove[0][1] &&
                        enPassantMove[1][0] === lastMove[1][0] &&
                        enPassantMove[1][1] === lastMove[1][1]
                    ) {
                        validMoves.push(moveCoords);
                    }
                }
            }
        }
    }
    return validMoves;
}
