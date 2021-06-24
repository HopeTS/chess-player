import React, { useEffect, useState, useCallback } from "react";

import ChessSquare from "./ChessSquare";
import { IClientChessMove, IClientChessState, coord, IChessPieceData, ISelectedPiece } from "../../types";
import * as api from "../../api/api";
import * as utils from "./utils/utils";
import SelectedPiece from "./SelectedPiece";

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

	// Array of coordinates of valid moves of focused piece
	let [validMoves, setValidMoves] = useState<coord[]>([]);

	// Selected piece (pass down to SelectedPiece)
	let [selectedPiece, setSelectedPiece] = useState<ISelectedPiece>({ piece: 0 });

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
						validMoves={validMoves}
						fromCoords={fromCoords}
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

	/** Make move */
	const make_move = useCallback(() => {
		// Ensure move is complete
		if (!fromCoords || !toCoords) return false;

		// Ensure move is valid
		let moveIsValid = false;
		for (let i = 0; i < validMoves.length; i++) {
			if (validMoves[i][0] === toCoords[0] && validMoves[i][1] === toCoords[1]) {
				moveIsValid = true;
			}
		}
		if (!moveIsValid) return false;

		// Send move data to server
		api.chess
			.make_move([fromCoords, toCoords])
			.then((newState) => {
				console.log(newState);
				newState && setChessState(newState);
			})
			.catch((err) => {
				console.error(err);
			});

		// Clear move coords
		cancel_move();
		return;
	}, [fromCoords, toCoords, validMoves]);

	// Move handler
	useEffect(() => {
		if (fromCoords && toCoords) make_move();
		if (!fromCoords) setSelectedPiece({ piece: 0 });
	}, [fromCoords, toCoords, make_move]);

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

	/** Handler for updating validMoves */
	const update_valid_moves = useCallback(
		(piece: IChessPieceData) => {
			// Ensure it is their turn
			if (piece.team === utils.get_turn(chessState.history)) {
				setValidMoves(utils.valid_moves.get(chessState, piece.coords));
			}
			return;
		},
		[chessState]
	);

	/** Handle picking up piece */
	const pick_up_piece = useCallback(
		(coords: coord) => {
			// Get selected piece
			const piece = utils.pieces.get_piece(chessState, coords);

			// Make sure piece can move this turn
			if (!piece) return;
			if (piece.team !== utils.get_turn(chessState.history)) return;

			setFromCoords(coords);
			if (piece) setSelectedPiece({ ...piece });
			update_valid_moves(piece);
			return;
		},
		[chessState, update_valid_moves]
	);

	/** Handle placing piece */
	const place_piece = (coords: coord) => {
		setToCoords(coords);
	};

	/** Handle piece selection (piece onClick) */
	const select_piece = useCallback(
		(coords: coord) => {
			if (!fromCoords) pick_up_piece(coords);
			else place_piece(coords);
			return;
		},
		[fromCoords, pick_up_piece]
	);

	/** Cancel move */
	const cancel_move = () => {
		setFromCoords(null);
		setToCoords(null);
		setSelectedPiece({ piece: 0 });
		setValidMoves([]);
	};

	return (
		<div className="ChessBoard">
			{squares.map((square) => square)}
			<SelectedPiece {...selectedPiece} />
		</div>
	);
}

export default ChessBoard;
