import React, { useState, useEffect, useRef } from "react";

import { IChessSquare, IChessPiece, team, piece, coord } from "../../types";
import ChessPiece from "./ChessPiece";

/** Chess square */
function ChessSquare(props: IChessSquare) {
	let color = (props.coords[0] % 2 === 0) !== (props.coords[1] % 2 === 0);

	// Chess piece data
	let [piece, setPiece] = useState<IChessPiece["piece"]>(0);
	let [team, setTeam] = useState<IChessPiece["team"]>(0);
	let [validMove, setValidMove] = useState<boolean>(false);

	useEffect(() => {
		/** Get piece data for square */
		function find_piece() {
			// Try white
			let tmpPiece: piece = props.chessState.white[props.coords[0]][props.coords[1]];
			let tmpTeam: team = 0;

			// Try black
			if (tmpPiece === 0) {
				tmpPiece = props.chessState.black[props.coords[0]][props.coords[1]];
				tmpTeam = 1;
			}

			setPiece(tmpPiece);
			setTeam(tmpTeam);
		}

		find_piece();
	}, [props.chessState]);

	useEffect(() => {
		let isValidMove: boolean = false;
		for (let i = 0; i < props.validMoves.length; i++) {
			if (props.validMoves[i][0] === props.coords[0] && props.validMoves[i][1] === props.coords[1]) {
				isValidMove = true;
			}
		}
		if (isValidMove) setValidMove(true);
		else setValidMove(false);
	}, [props.validMoves]);

	return (
		<div className="ChessSquare" data-color={color}>
			<div className="ChessSquare__valid" data-active={validMove}>
				<ChessPiece
					piece={piece}
					team={team}
                    coords={props.coords}
                    fromCoords={props.fromCoords}
					select_piece={props.select_piece}
					cancel_move={props.cancel_move}
				/>
			</div>
		</div>
	);
}

export default ChessSquare;
