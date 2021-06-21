import { coord, movePath } from "../../../../types";
import { is_on_board } from "../is_on_board";

/** Get all possible paths of queen from given coordinates */
export function queen(coords: coord): movePath[] {
	let possiblePaths: movePath[] = [];

	// N
	let path: coord[] = [];
	for (let i = coords[0] - 1; i >= 0; i--) {
		path.push([i, coords[1]]);
	}
	path && possiblePaths.push(path);

	// S
	path = [];
	for (let i = coords[0] + 1; i <= 7; i++) {
		path.push([i, coords[1]]);
	}
	path && possiblePaths.push(path);

    // E
    path = []
    for (let i = coords[1] + 1; i <= 7; i++) {
		path.push([coords[0], i]);
	}
	path && possiblePaths.push(path);

    // W
    path = []
    for (let i = coords[1] - 1; i >= 0; i--) {
		path.push([coords[0], i]);
	}
	path && possiblePaths.push(path);

	// NE
	path = [];
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
