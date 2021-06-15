import React, { useEffect, useState } from "react";

import "./ChessBoard.scss";
import ChessSquare from "./ChessSquare";
import { IClientChessMove, IClientChessState, coord } from "../../types";
import { start_game } from "../../api/chess";

/** Chess board */
function ChessBoard() {
	// State of chess game
	let [chessState, setChessState] = useState<IClientChessState>({
		white: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		],
		black: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		],
		history: [],
		castle: [
			[true, true, true],
			[true, true, true],
		],
	});

    // Valid paths for selected piece (fromCoords)
	let [validPaths, setValidPaths] = useState<[coord?]>([]);

	// Move coordinates ([from, to])
	let [fromCoords, setFromCoords] = useState<IClientChessMove["from"] | null>(null);
	let [toCoords, setToCoords] = useState<IClientChessMove["to"] | null>(null);

	/** Generate board square components */
	const construct_board = (): JSX.Element[] => {
		let tmpSquares: JSX.Element[] = [];
		for (let i = 0; i < 8; i++) {
			// Rank
			for (let j = 0; j < 8; j++) {
				// File
				tmpSquares.push(
					<ChessSquare
						coords={[i, j]}
						chessState={chessState}
						key={`${i}${j}`}
						select_piece={() => select_piece([i, j])}
						cancel_move={() => cancel_move()}
					/>
				);
			}
		}
		return tmpSquares;
	};

	// Chess square components
	let squares: JSX.Element[] = [];
	squares = construct_board();

	// Init
	useEffect(() => {
		handle_start_game();
	}, []);

	/** Start game  */
	const handle_start_game = () => {
		start_game()
			.then((startState) => {
				startState && setChessState(startState);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	/** Make move */
	const make_move = () => {
		// TODO: Make endpoint calls
		return;
	};

	/** Calculate valid paths of fromCoords */
	const get_valid_paths = () => {
		//TODO
		return;
	};

	/** Handle piece selection (piece onClick) */
	const select_piece = (coords: coord) => {
		console.log("Piece selected", coords);
		// TODO: Figure out why piece selected (piece to move, or square to move it to?)
		if (!fromCoords) {
			setFromCoords(coords);
			get_valid_paths();
		} else {
			setToCoords(coords);
			make_move();
		}
		return;
	};

	/** Cancel move */
	const cancel_move = () => {
		console.log("Move cancelled");
		setFromCoords(null);
		setToCoords(null);
	};

	return (
		<div className="ChessBoard" onMouseLeave={cancel_move}>
			{squares.map((square) => square)}
		</div>
	);
}

export default ChessBoard;
