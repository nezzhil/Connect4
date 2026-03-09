import { Board } from "./board";
import { Player } from "./player";

type State = {
    Player: Player
    Description: String,
    Win: Boolean
}

export function checkState(board: Board, player: Player): State {
    var state: State = {
        Player: player,
        Description: "Not enough info",
        Win: false
    };

    return state;
}