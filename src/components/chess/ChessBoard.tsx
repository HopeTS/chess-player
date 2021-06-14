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
		castle: [],
	});

	// Whether or not player is currently moving a piece
	let [movingPiece, setMovingPiece] = useState<boolean>(false);

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
				tmpSquares.push(<ChessSquare coords={[i, j]} chessState={chessState} key={`ij`} />);
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

	// Handle move state
	useEffect(() => {}, [movingPiece, fromCoords, toCoords]);

	/** Start game  */
	const handle_start_game = () => {
		start_game()
			.then((startState) => {
				startState && setChessState(startState);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	/** Pick up a piece (Get 'from' coords for move) */
	const pick_up_piece = (coords: coord) => {
		//TODO
	};

	/** Place piece (Get 'to' coords for move) */
	const place_piece = (coords: coord) => {
		//TODO
	};

	/** Make move */
	const make_move = (move: IClientChessMove) => {
		// TODO: Make endpoint calls
	};

	/** Cancel move */
	const cancel_move = () => {
		setMovingPiece(false);
		setFromCoords(null);
		setToCoords(null);
	};

	return <div className="ChessBoard">{squares.map((square) => square)}</div>;
}

export default ChessBoard;
