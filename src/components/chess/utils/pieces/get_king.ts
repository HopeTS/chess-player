import { board, coord } from "../../../../types";

export function get_king(board: board): coord {
    let kingCoords: coord = [0, 0];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 6) {
                kingCoords = [i, j]
                break;
            }
        }
    }

    return kingCoords;
}
