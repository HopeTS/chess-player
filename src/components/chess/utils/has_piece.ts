import { board, coord } from "../../../types";

/** Check whether board has piece on given coordinates */
export function has_piece(board: board, coords: coord): boolean {
    return (board[coords[0]][coords[1]] !== 0);
}