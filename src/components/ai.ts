import env from "react-dotenv";
import { Board } from "./board";
import { Player } from "./player";
import { Cell } from "./cell";
import { checkWinner, player1, player2 } from "./game";

type State = {
    Player: Player | null
    Win: boolean
}

function checkState(board: Board, player: Player): State {
    var state: State = {
        Player: player,
        Win: false
    };

    for (let row = 0; row < env.ROWS; row++) {
        for (let col = 0; col < env.COLUMNS; col++) {            
            if (board[row][col].state !== player) continue;
            if (checkWinner(board, row, col, player)) {
                state.Win = true;
                return state;
            }
        }
    }

    return state;
}

function calculateScore(window: Cell[], player: Player) : number {
    const rival = player === player1 ? player2 : player1;
    
    const countPlayer = window.filter(c => c.state === player).length;
    const countRival  = window.filter(c => c.state === rival).length;
    const countEmpty  = window.filter(c => c.state === null).length;
    const posWeight   = window.reduce((sum, c) => sum + c.value, 0) / 4;

    if (countPlayer === 4)                     return  100 * posWeight;
    if (countPlayer === 3 && countEmpty === 1) return    5 * posWeight;
    if (countPlayer === 2 && countEmpty === 2) return    2 * posWeight;
    if (countRival  === 3 && countEmpty === 1) return   -4 * posWeight;
    if (countRival  === 4)                     return -100 * posWeight;

    return 0;
}

function validColumns(board: Board): number[] {
    let columns: number[] = [];
    for (let col = 0; col < env.COLUMNS; col++) {
        if (board[0][col].state == null) {
            columns.push(col);
        }
    }

    return columns;
}

function cellAvailable(board: Board, column: number): number {
    for (let row = env.ROWS-1; row >= 0; row--) {
        if (board[row][column].state === null) {
            return row;
        }
    }
    return -1;
}

function evaluate(board: Board, player: Player): number {

    let score = 0;
    const directions = [[0,1],[1,0],[1,1],[1,-1]];

    for (let row = 0; row < env.ROWS; row++) {
        for (let col = 0; col < env.COLUMNS; col++) {            
            const cell = board[row][col];
            
            if (cell.state === player) {
                score += cell.value;
            }

            for (const [dirRow, dirCol] of directions) {
                
                const window: Cell[] = [cell];
                let r = row + dirRow;
                let c = col + dirCol;
                while (r >= 0 && r < env.ROWS && c >= 0 && c < env.COLUMNS) {
                    window.push(board[r][c]);
                    if (window.length === 4) break;
                    r += dirRow; 
                    c += dirCol;
                }
                if (window.length === 4) {
                    score += calculateScore(window, player);
                }
            }
        }
    }

    return score;
};

function alphaBeta(board: Board, depth: number, alpha: number, beta: number, isMax: boolean): number {
    const stateP1 = checkState(board, player1);
    const stateP2 = checkState(board, player2);

    if (stateP1.Win) {
        return -1000;
    }
    if (stateP2.Win) {
        return 1000;
    }
    if (board.every(row => row.every(cell => cell.state !== null))) {
        return 0;
    }
    if (depth == 0) {
        return evaluate(board, player2);
    }

    const columns = validColumns(board);
    if (isMax) {
        let value = -Infinity;
        for(const col of columns) {
            const row = cellAvailable(board, col);
            board[row][col].state = player2;
            value = Math.max(value, alphaBeta(board, depth-1, alpha, beta, false));
            board[row][col].state = null;
            alpha = Math.max(alpha, value);
            if (beta <= alpha) {
                break;
            }
        }
        return value;
    }
    else {
        let value = Infinity;
        for(const col of columns) {
            const row = cellAvailable(board, col);
            board[row][col].state = player1;
            value = Math.min(value, alphaBeta(board, depth-1, alpha, beta, true));
            board[row][col].state = null;
            beta = Math.min(beta, value);
            if (beta <= alpha) {
                break;
            }
        }
        return value;
    }
}

function getDropAI(board: Board): number {
    let bestColumn = -1;
    let bestValue = -Infinity;

    for (const col of validColumns(board)) {
        const row = cellAvailable(board, col);
        board[row][col].state = player2;
        const value = alphaBeta(board, 5, -Infinity, Infinity, false);
        board[row][col].state = null;
        if (value > bestValue) {
            bestColumn = col;
            bestValue = value;
        }

    }


    return bestColumn;
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


export {evalBoard, getDropAI}