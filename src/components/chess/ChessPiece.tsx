import React, { useEffect, useState } from "react";
import { FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing } from "react-icons/fa";

import "./ChessPiece.scss";
import { IChessPiece } from "../../types";

/** Chess piece (image) */
function ChessPiece(props: IChessPiece) {
	const team = props.team === 0 ? "white" : "black";

	switch (props.piece) {
		case 0:
			return <div className="ChessPiece"></div>;
		case 1:
			return (
				<div className="ChessPiece" data-team={team}>
					<FaChessPawn size="30px" />
				</div>
			);
		case 2:
			return (
				<div className="ChessPiece" data-team={team}>
					<FaChessRook size="30px" />
				</div>
			);
		case 3:
			return (
				<div className="ChessPiece" data-team={team}>
					<FaChessKnight size="30px" />
				</div>
			);
		case 4:
			return (
				<div className="ChessPiece" data-team={team}>
					<FaChessBishop size="30px" />
				</div>
			);
		case 5:
			return (
				<div className="ChessPiece" data-team={team}>
					<FaChessQueen size="30px" />
				</div>
			);
		case 6:
			return (
				<div className="ChessPiece" data-team={team}>
					<FaChessKing size="30px" />
				</div>
			);
	}
}

export default ChessPiece;
