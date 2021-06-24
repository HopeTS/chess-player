import { coord, IClientChessState, IChessPieceData } from "../../../../types";

/** Get piece data from given chess state and coordinates */
export function get_piece(chessState: IClientChessState, coords: coord): IChessPieceData | undefined {
    // Check for white
    if (chessState.white[coords[0]][coords[1]] !== 0) {
        return {
            piece: chessState.white[coords[0]][coords[1]],
            team: 0,
            coords: coords,
        };
    }

    // Check for black
    else if (chessState.black[coords[0]][coords[1]] !== 0) {
        return {
            piece: chessState.black[coords[0]][coords[1]],
            team: 1,
            coords: coords,
        };
    } else return undefined;
}
