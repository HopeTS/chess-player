import React, { useState, useEffect, useCallback } from "react";

import "./ChessSquare.scss";
import { IChessSquare, IChessPiece, team, piece } from "../../types";
import ChessPiece from "./ChessPiece";

/** Chess square */
function ChessSquare(props: IChessSquare) {
	let color = (props.coords[0] % 2 === 0) !== (props.coords[1] % 2 === 0);

	// Chess piece data
	let [piece, setPiece] = useState<IChessPiece["piece"]>(0);
	let [team, setTeam] = useState<IChessPiece["team"]>(0);

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
	}, [props.chessState, props.coords]);

	return (
		<div className="ChessSquare" data-color={color}>
			<ChessPiece piece={piece} team={team} />
		</div>
	);
}

export default ChessSquare;
