import { coord, movePath } from "../../../../types";

/** Get all possible paths of rook from given coordinates */
export function rook(coords: coord): movePath[] {
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
	path = [];
	for (let i = coords[1] + 1; i <= 7; i++) {
		path.push([coords[0], i]);
	}
	path && possiblePaths.push(path);

	// W
	path = [];
	for (let i = coords[1] - 1; i >= 0; i--) {
		path.push([coords[0], i]);
	}
	path && possiblePaths.push(path);

	return possiblePaths;
}
