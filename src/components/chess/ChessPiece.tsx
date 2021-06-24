import React, { useEffect, useState } from "react";
import { FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing } from "react-icons/fa";

import { IChessPiece, piece } from "../../types";

/** Chess piece (image) */
function ChessPiece(props: IChessPiece) {
	const team = props.team === 0 ? "white" : "black";
	const pieces = {
		0: null,
		1: <FaChessPawn size="30px" />,
		2: <FaChessRook size="30px" />,
		3: <FaChessKnight size="30px" />,
		4: <FaChessBishop size="30px" />,
		5: <FaChessQueen size="30px" />,
		6: <FaChessKing size="30px" />,
	};

	const [piece, setPiece] = useState<piece>(0);

	useEffect(() => {
		// Check whether or not current piece is focused
		if (props.fromCoords && props.fromCoords[0] === props.coords[0] && props.fromCoords[1] === props.coords[1]) {
			setPiece(0);
		} else setPiece(props.piece);
	}, [props.piece, props.fromCoords, props.coords]);

	/** Handle left click */
	const handle_click = (e: any) => {
		props.select_piece();
	};

	/** Handle right click */
	const handle_right_click = (e: any) => {
		e.preventDefault();
		props.cancel_move();
	};

	return (
		<div
			className="ChessPiece"
			data-team={team}
			onMouseDown={(e) => handle_click(e)}
			onMouseUp={(e) => handle_click(e)}
			onContextMenu={(e) => handle_right_click(e)}
		>
			{pieces[piece]}
		</div>
	);
}

export default ChessPiece;
