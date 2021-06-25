import { IChessBoardDevPanel } from "../../types";

/** Component handling development tools for the ChessBoard component */
export function ChessBoardDevPanel(props: IChessBoardDevPanel) {
	return (
		<div className="ChessBoardDevPanel">
			<div className="ChessBoardDevPanel__control">
				<button onClick={() => console.log(props.chessState)}>Log state</button>
				<button onClick={() => console.clear()}>Clear console</button>
				<button onClick={() => props.handle_start_game()}>Restart game</button>
			</div>
		</div>
	);
}

export default ChessBoardDevPanel;
