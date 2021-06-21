import { coord, movePath } from "../../../../types";
import { is_on_board } from "../is_on_board";

/** Get all possible paths of bishop from given coordinates */
export function bishop(coords: coord): movePath[] {
	let possiblePaths: movePath[] = [];

	// NE
	let path: coord[] = [];
    for (let i=0; i <= 7; i++) {
        let moveCoords: coord = [coords[0] - (1 + i), coords[1] + (1 + i)]
        if (is_on_board(moveCoords)) {
            path.push(moveCoords)
        }
    }
	path && possiblePaths.push(path);

	// NW
	path = [];
	for (let i=0; i <= 7; i++) {
        let moveCoords: coord = [coords[0] - (1 + i), coords[1] - (1 + i)]
        if (is_on_board(moveCoords)) {
            path.push(moveCoords)
        }
    }
	path && possiblePaths.push(path);

	// SE
	path = [];
	for (let i=0; i <= 7; i++) {
        let moveCoords: coord = [coords[0] + (1 + i), coords[1] + (1 + i)]
        if (is_on_board(moveCoords)) {
            path.push(moveCoords)
        }
    }
	path && possiblePaths.push(path);

	// SW
	path = [];
	for (let i=0; i <= 7; i++) {
        let moveCoords: coord = [coords[0] + (1 + i), coords[1] - (1 + i)]
        if (is_on_board(moveCoords)) {
            path.push(moveCoords)
        }
    }
	path && possiblePaths.push(path);

	return possiblePaths;
}
