import { coord, IChessPieceData, IClientChessState, movePath } from "../../../../types";
import * as possible from "../possible_paths/possible_paths";

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

	//TODO: Remove all moves that would put the king in check
	return validMoves;
}
