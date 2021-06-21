import { coord, IChessPieceData, IClientChessState, movePath } from "../../../../types";
import { has_piece } from "../has_piece";
import * as possible from "../possible_paths/possible_paths";

export function king(chessState: IClientChessState, piece: IChessPieceData): coord[] {
    let validMoves: coord[] = []
    const possiblePaths = possible.king(piece.coords)

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

    //TODO: Remove all moves that would put the king in check
    return validMoves;
}