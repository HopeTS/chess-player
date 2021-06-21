import { coord, movePath } from "../../../../types";
import { is_on_board } from "../is_on_board";

/** Get all possible paths of knight from given coordinates */
export function knight(coords: coord): movePath[] {
    let possiblePaths: movePath[] = [];

	let possibleCoords: coord[] = [
		[coords[0] + 2, coords[1] + 1],
		[coords[0] + 2, coords[1] - 1],
		[coords[0] - 2, coords[1] + 1],
		[coords[0] - 2, coords[1] - 1],
		[coords[0] - 1, coords[1] + 2],
		[coords[0] + 1, coords[1] + 2],
		[coords[0] - 1, coords[1] - 2],
		[coords[0] + 1, coords[1] - 2],
	];

	for (let i = 0; i < possibleCoords.length; i++) {
		if (is_on_board(possibleCoords[i])) {
            possiblePaths.push([possibleCoords[i]]);
        }
	}
	return possiblePaths;
}