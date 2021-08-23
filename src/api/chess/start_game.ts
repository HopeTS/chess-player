// Handle all endpoints related to chess games
import { IServerChessState, IClientChessState, movePath, coord } from "../../types";

/** GET chess/start endpoint and convert to client data */
export function start_game(): Promise<IClientChessState | false> {
    return fetch(`${process.env.REACT_APP_FLASK_SERVER}/api/chess/start_game`)
        .then((res) => res.json())
        .then((data: IServerChessState) => {
            return data;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
}
