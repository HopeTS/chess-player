import React, { useEffect } from "react";

import * as chess from "../api/chess/chess";
import ChessBoard from "../components/chess/ChessBoard";

/** Chess development environment page */
function Dev() {
	useEffect(() => {
		chess.start_game();
		console.log("Here!");
	}, []);

	return (
		<div className="Game">
			<ChessBoard dev={true} />
		</div>
	);
}

export default Dev;
