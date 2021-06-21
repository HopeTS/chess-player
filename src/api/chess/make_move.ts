import { IServerChessState, IClientChessState, move, movePath, coord } from "../../types";

/** POST chess/move endpoint and convert to client data */
export function make_move(move: move): Promise<IClientChessState | false> {
	return fetch(`${process.env.REACT_APP_FLASK_SERVER}/chess/make_move`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ move: move }),
	})
		.then((res) => res.json())
		.then((data: IServerChessState): IClientChessState => {
			console.log(process.env.REACT_APP_FLASK_SERVER);
			return data;
		})
		.catch((err) => {
			console.error(err);
			return false;
		});
}
