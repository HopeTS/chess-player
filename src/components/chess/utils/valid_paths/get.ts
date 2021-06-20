import { coord, IChessPiece, IClientChessState } from "../../../../types";

/** 
 * Use the state of the chess board to get the valid paths of a piece.
 * Middle man function for each piece.
 */
export function get(chessState: IClientChessState, coords: coord): [coord?] {
    let validMoves: [coord?] = []

    //TODO: Find piece
    //TODO: Execute respective validPaths function

    return validMoves;
}