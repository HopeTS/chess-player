import { coord, IChessPieceData, IClientChessState, movePath, team } from "../../../../types";
import { has_piece } from "../has_piece";
import * as possible from "../possible_paths/possible_paths";

/** Get all valid moves of a king given the state of the chess board */
export function king(chessState: IClientChessState, piece: IChessPieceData): coord[] {
	let validMoves: coord[] = [];
	const possiblePaths = possible.king(piece.coords);

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

	// Black castle
	if (piece.team === 1 && chessState.castle[0][1]) {
		// Left castle
		if (chessState.castle[0][0]) {
			let canCastle = true;

			// Ensure squares between king and rook are empty
			const castleSquares: movePath = [
				[0, 1],
				[0, 2],
				[0, 3],
			];
			for (let i = 0; i < castleSquares.length; i++) {
				if (has_piece(chessState.white, castleSquares[i]) || has_piece(chessState.black, castleSquares[i])) {
					canCastle = false;
				}
			}

			// Add castle moves
			if (canCastle) {
				validMoves.push([0, 1]);
				validMoves.push([0, 2]);
			}
		}

		// Black right castle
		if (chessState.castle[0][2]) {
			let canCastle = true;

			// Ensure squares between king and rook are empty
			const castleSquares: movePath = [
				[0, 5],
				[0, 6],
			];
			for (let i = 0; i < castleSquares.length; i++) {
				if (has_piece(chessState.white, castleSquares[i]) || has_piece(chessState.black, castleSquares[i])) {
					canCastle = false;
				}
			}

			// Add castle moves
			if (canCastle) {
				validMoves.push([0, 6]);
			}
		}
	}

	// White castle
	else if (piece.team === 0 && chessState.castle[1][1]) {
		// Left castle
		if (chessState.castle[1][0]) {
            let canCastle = true;

			// Ensure squares between king and rook are empty
			const castleSquares: movePath = [
				[7, 1],
				[7, 2],
				[7, 3],
			];
			for (let i = 0; i < castleSquares.length; i++) {
				if (has_piece(chessState.white, castleSquares[i]) || has_piece(chessState.black, castleSquares[i])) {
					canCastle = false;
				}
			}

			// Add castle moves
			if (canCastle) {
				validMoves.push([7, 1]);
				validMoves.push([7, 2]);
			}
		}

		// Right castle
		if (chessState.castle[1][2]) {
            let canCastle = true;

			// Ensure squares between king and rook are empty
			const castleSquares: movePath = [
				[7, 5],
				[7, 6],
			];
			for (let i = 0; i < castleSquares.length; i++) {
				if (has_piece(chessState.white, castleSquares[i]) || has_piece(chessState.black, castleSquares[i])) {
					canCastle = false;
				}
			}

			// Add castle moves
			if (canCastle) {
				validMoves.push([7, 6]);
			}
		}
	}

	//TODO: Remove all moves that would put the king in check
	return validMoves;
}
