import React, { useEffect, useState } from "react";

import ChessSquare from "./ChessSquare";
import { IClientChessMove, IClientChessState, coord } from "../../types";
import * as api from "../../api/api";
import * as utils from "./utils/utils";

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

	// Move coordinates ([from, to])
	let [fromCoords, setFromCoords] = useState<IClientChessMove["from"] | null>(null);
	let [toCoords, setToCoords] = useState<IClientChessMove["to"] | null>(null);

	// Flag for whether or not a piece is currently focused
	let [pieceFocused, setPieceFocused] = useState<boolean>(false);

	// Array of coordinates of valid moves of focused piece
	let [validMoves, setValidMoves] = useState<coord[]>([]);

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
						pieceFocused={pieceFocused}
						validMoves={validMoves}
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

	// Move handler
	useEffect(() => {
		fromCoords && get_valid_paths();
		fromCoords && toCoords && make_move();
	}, [fromCoords, toCoords]);

	/** Start game  */
	const handle_start_game = () => {
		api.chess
			.start_game()
			.then((startState) => {
				startState && setChessState(startState);
			})
			.catch((e) => {
				console.error(e);
			});
	};

	useEffect(() => {
		console.log(validMoves);
	}, [validMoves]);

	/** Make move */
	const make_move = () => {
		if (!fromCoords || !toCoords) return false;

		api.chess
			.make_move([fromCoords, toCoords])
			.then((newState) => {
				console.log(newState);
				newState && setChessState(newState);
			})
			.catch((err) => {
				console.error(err);
			});

		cancel_move();
		return;
	};

	/** Calculate valid paths of fromCoords */
	const get_valid_paths = () => {
		//const newValidPaths = utils.valid_paths.get();
		return;
	};

	/** Handle piece selection (piece onClick) */
	const select_piece = (coords: coord) => {
		console.log("Piece selected", coords);

		setValidMoves(utils.valid_moves.get(chessState, coords));

		if (!fromCoords) {
			console.log("step 1");
			setFromCoords(coords);
		} else {
			console.log("step 2");
			setToCoords(coords);
		}
		return;
	};

	/** Cancel move */
	const cancel_move = () => {
		setFromCoords(null);
		setToCoords(null);
		setValidMoves([]);
	};

	return <div className="ChessBoard">{squares.map((square) => square)}</div>;
}

export default ChessBoard;
