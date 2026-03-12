import env from "react-dotenv";
import { Board } from "./board";
import { Player } from "./player";
import { Cell } from "./cell";

type State = {
    Player: Player
    Description: String,
    Win: Boolean
}

function checkState(board: Board, player: Player): State {
    var state: State = {
        Player: player,
        Description: "Not enough info",
        Win: false
    };

    return state;
}

function evalBoard(board: Board): Board {
    const directions = [[0,1],[1,0],[1,1],[1,-1]];
    for (let row = 0; row < env.ROWS; row++) {
        for (let col = 0; col < env.COLUMNS; col++) {
            board[row][col].x = row;
            board[row][col].y = col;
            for (const [dirRow, dirCol] of directions) {
                const cells: Cell[] = [board[row][col]];
                let r = row + dirRow;
                let c = col + dirCol;
                while (r >= 0 && r < env.ROWS && c >= 0 && c < env.COLUMNS) {
                    cells.push(board[r][c]);
                    r += dirRow; 
                    c += dirCol;
                    if (cells.length == 4) break;
                }
                if (cells.length == 4) {
                    cells.forEach((cell) => cell.value++);
                }                
            }
        }
    }
  
    return board;
}


export {checkState, evalBoard}