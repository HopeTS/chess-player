import { coord } from "../../../types";

/** Check whether given coordinates are on the chess board */
export function is_on_board(coords: coord): boolean {
	return coords[0] >= 0 && coords[0] <= 7 && coords[1] >= 0 && coords[1] <= 7;
}
