import React, { useState, useEffect } from "react";
import { FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing } from "react-icons/fa";

import { coord, IChessPieceData, ISelectedPiece, piece, team } from "../../types";

/** Selected piece (follows mouse cursor) */
function SelectedPiece(props: ISelectedPiece | null) {
	const pieces = {
		0: null,
		1: <FaChessPawn size="30px" />,
		2: <FaChessRook size="30px" />,
		3: <FaChessKnight size="30px" />,
		4: <FaChessBishop size="30px" />,
		5: <FaChessQueen size="30px" />,
		6: <FaChessKing size="30px" />,
	};

	// state from props (to handle null)
	const [piece, setPiece] = useState<piece>(0);
	const [team, setTeam] = useState<team | undefined>(undefined);

	useEffect(() => {
		// Make SelectedPiece follow cursor
		document.addEventListener("mousemove", follow_cursor);
	}, []);

	useEffect(() => {
		// Update state from props
		if (props) {
			setPiece(props.piece);
			setTeam(props.team);
		}

		// Clear state if null
		else {
			setPiece(0);
			setTeam(undefined);
		}
	}, [props]);

	/** Make SelectedPiece follow cursor */
	const follow_cursor = () => {
		let selectedPiece = document.getElementById("SelectedPiece");
		let e: any = window.event;
		let offsetLeft = e.clientX;
		let offsetTop = e.clientY;
		if (selectedPiece) selectedPiece.style.left = offsetLeft + "px";
		if (selectedPiece) selectedPiece.style.top = offsetTop + "px";
	};

	return (
		<div id="SelectedPiece" className="SelectedPiece" data-team={team ? "black" : "white"}>
			{pieces[piece]}
		</div>
	);
}

export default SelectedPiece;
