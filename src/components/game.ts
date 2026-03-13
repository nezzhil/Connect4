import { Board } from "./board";
import env from 'react-dotenv';
import { Player } from "./player";

function checkWinner(board: Board, row: number, col: number, player: Player): boolean {
  const directions = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dirRow, dirCol] of directions) {
    let count = 1;
    for (const sign of [1, -1]) {
      let r = row + dirRow * sign;
      let c = col + dirCol * sign;
      while (r >= 0 && r < env.ROWS && c >= 0 && c < env.COLUMNS && board[r][c].state === player) {
        count++; 
        r += dirRow * sign; 
        c += dirCol * sign;
      }
    }
    if (count >= 4) { 
        return true;
    }
  }
  return false;
}

const player1: Player = {
    Id: 1,
    Description: "Player 1"
};

const player2: Player = {
    Id: 2,
    Description: "Player 2"
};

const draw: Player = {
    Id: 0,
    Description: "Draw"
};

export {checkWinner, player1, player2, draw}