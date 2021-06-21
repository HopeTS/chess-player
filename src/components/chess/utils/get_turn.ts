import { IClientChessState, team } from "../../../types";

/** Return whos team it is. 0 = white, 1 = black */
export function get_turn(history: IClientChessState["history"]): team {
	if (!(history.length % 2)) return 0;
	else return 1;
}
