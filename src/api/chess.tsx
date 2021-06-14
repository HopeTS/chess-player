// Handle all endpoints related to chess games
import { IServerChessState, IClientChessState } from "../types";

/** Get chess/start endpoint and convert to client data */
export function start_game(): Promise<IClientChessState | false> {
	return fetch("http://localhost:3000/chess/start")
		.then((res) => res.json())
		.then((data: IServerChessState) => {
			console.log("Here is state");
			console.log(data.black);
			console.log(data.white);
			console.log(data.history);
			console.log(data.castle);
			const clientData: IClientChessState = { ...data };
			return clientData;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
}
