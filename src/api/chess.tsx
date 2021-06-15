// Handle all endpoints related to chess games
import { IServerChessState, IClientChessState, move } from "../types";

/** GET chess/start endpoint and convert to client data */
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
			console.error(err);
			return false;
		});
}

/** POST chess/move endpoint and convert to client data */
export function make_move(move: move): Promise<IClientChessState | false> {
	return fetch("http://localhost:3000/chess/move", {
        method: 'POST',
        body: JSON.stringify({move: move}),
        headers: {
            'Content-Type': 'application/json'
        },
    })
		.then((res) => res.json())
		.then((data: IServerChessState): IClientChessState => {
            return data;
        })
		.catch((err) => {
			console.error(err);
			return false;
		});
}
