import { coord, IChessPieceData, IClientChessState } from "../../../../types";
import { has_piece } from "../has_piece";
import { is_on_board } from "../is_on_board";

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
			moveCoords = [piece.coords[0] - 2, piece.coords[1]];
			if (is_on_board(moveCoords)) {
				hasPiece = has_piece(chessState.white, moveCoords) || has_piece(chessState.black, moveCoords);
				if (!hasPiece) validMoves.push(moveCoords);
			}
		}

		// Left capture
		moveCoords = [piece.coords[0] - 1, piece.coords[1] - 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.black, moveCoords);
            if (hasPiece) validMoves.push(moveCoords)
        }

		// Right capture
		moveCoords = [piece.coords[0] - 1, piece.coords[1] + 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.black, moveCoords);
            if (hasPiece) validMoves.push(moveCoords)
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
            if (hasPiece) validMoves.push(moveCoords)
        }

		// Right capture
		moveCoords = [piece.coords[0] + 1, piece.coords[1] + 1];
        if (is_on_board(moveCoords)) {
            hasPiece = has_piece(chessState.white, moveCoords);
            if (hasPiece) validMoves.push(moveCoords)
        }
	}
	return validMoves;
}
