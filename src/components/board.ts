import { Cell } from "./cell"

type Board = Cell[][];

function createBoard(ROWS: number, COLUMNS: number): Board {
  return Array.from({ length: ROWS }, () => Array(COLUMNS).fill("null"));
}

export { Board, createBoard };