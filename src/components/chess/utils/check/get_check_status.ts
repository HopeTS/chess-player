import { IChessCheckStatus, IClientChessState } from "../../../../types";
import { get_black_check_status } from "./get_black_check_status";
import { get_white_check_status } from "./get_white_check_status";

/** Check whether white or black king is in check */
export function get_check_status(chessState: IClientChessState) {
	let checkStatus: IChessCheckStatus = {
		white: get_white_check_status(chessState),
		black: get_black_check_status(chessState),
	};

	return checkStatus;
}
