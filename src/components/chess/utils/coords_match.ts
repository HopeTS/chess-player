import { coord } from "../../../types";

/** Check if two coordinates match */
export function coords_match(coordOne: coord, coordTwo: coord): boolean {
    if (coordOne[0] === coordTwo[0] && coordOne[1] === coordTwo[1]) return true;
    else return false;
}
