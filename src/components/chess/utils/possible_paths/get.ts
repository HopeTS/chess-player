import { IChessPieceData, movePath } from "../../../../types";
import { bishop } from "./bishop";
import { king } from "./king";
import { knight } from "./knight";
import { queen } from "./queen";
import { rook } from "./rook";

/** Get possible paths of a piece from piece data (Excluding pawns) */
export function get(piece: IChessPieceData): movePath[] {
    let possiblePaths: movePath[] = [];

    switch (piece.piece) {
        case 0:
            break;
        case 1:
            // Pawn handling is unique to each case
            break;
        case 2:
            possiblePaths = rook(piece.coords);
            break;
        case 3:
            possiblePaths = knight(piece.coords);
            break;
        case 4:
            possiblePaths = bishop(piece.coords);
            break;
        case 5:
            possiblePaths = queen(piece.coords);
            break;
        case 6:
            possiblePaths = king(piece.coords);
            break;
    }

    return possiblePaths;
}
