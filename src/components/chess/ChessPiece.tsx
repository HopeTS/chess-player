import React, { useEffect, useState } from "react";
import { FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing } from "react-icons/fa";

import "./ChessPiece.scss";
import { IChessPiece } from "../../types";

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

	/** Handle click */
	const handle_click = (e: any) => {
		props.select_piece();
	};

	const handle_right_click = (e: any) => {
		e.preventDefault();
		props.cancel_move();
	};

	return (
		<div
			className="ChessPiece"
			data-team={team}
			onClick={(e) => handle_click(e)}
			onContextMenu={(e) => handle_right_click(e)}
		>
			{pieces[props.piece]}
		</div>
	);
}

export default ChessPiece;
