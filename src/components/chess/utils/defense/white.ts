import { board, coord, IChessPieceData, IClientChessState } from "../../../../types";
import { coords_match } from "../coords_match";
import { get_white_pieces } from "../pieces/get_white_pieces";
import { get_black_pieces } from "../pieces/get_black_pieces";
import { possible_paths } from "../utils";

/** How many pieces are defending each white piece */
export function white(chessState: IClientChessState): board {
    let defenseData: board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ];

    // Get pieces
    const blackPieces = get_black_pieces(chessState);
    const whitePieces = get_white_pieces(chessState);
    let whiteNonPawnPieces: IChessPieceData[] = [];
    let whitePawnPieces: IChessPieceData[] = [];

    // Get team piece coordinates
    let whitePiecesCoords: coord[] = [];
    let blackPiecesCoords: coord[] = [];
    for (let i = 0; i < whitePieces.length; i++) {
        whitePiecesCoords.push(whitePieces[i].coords);
    }
    for (let i = 0; i < blackPieces.length; i++) {
        blackPiecesCoords.push(blackPieces[i].coords);
    }

    // Separate pawns and other pieces
    for (let i = 0; i < whitePieces.length; i++) {
        if (whitePieces[i].piece === 1) whitePawnPieces.push(whitePieces[i]);
        else whiteNonPawnPieces.push(whitePieces[i]);
    }

    // Non pawn pieces
    for (let i = 0; i < whiteNonPawnPieces.length; i++) {
        const paths = possible_paths.get(whiteNonPawnPieces[i]);

        // Iterate through each path and look for defended piece
        for (let j = 0; j < paths.length; j++) {
            for (let k = 0; k < paths[j].length; k++) {
                let pathClear = false;

                // Check for other team piece in these coordinates
                for (let l = 0; l < blackPiecesCoords.length; l++) {
                    if (coords_match(blackPiecesCoords[l], paths[j][k])) {
                        pathClear = true;
                        break;
                    }
                }
                if (pathClear) break;

                // Check for same team piece (defended piece) in these coordinates
                for (let l = 0; l < whitePiecesCoords.length; l++) {
                    if (coords_match(whitePiecesCoords[l], paths[j][k])) {
                        // Update defended piece graph
                        defenseData[paths[j][k][0]][paths[j][k][1]] += 1;

                        pathClear = true;
                        break;
                    }
                }
                if (pathClear) break;
            }
        }
    }

    // Pawn pieces
    for (let i = 0; i < whitePawnPieces.length; i++) {
        const pawn = whitePawnPieces[i];

        // Check for same team piece in capturable coords
        const leftCapture: coord = [pawn.coords[0] - 1, pawn.coords[1] - 1];
        const rightCapture: coord = [pawn.coords[0] - 1, pawn.coords[1] + 1];
        for (let j = 0; j < whitePiecesCoords.length; j++) {
            if (coords_match(whitePiecesCoords[j], leftCapture)) {
                defenseData[leftCapture[0]][leftCapture[1]] += 1;
            }
            else if (coords_match(whitePiecesCoords[j], rightCapture)) {
                defenseData[rightCapture[0]][rightCapture[1]] += 1;
            }
        }
    }

    return defenseData;
}
