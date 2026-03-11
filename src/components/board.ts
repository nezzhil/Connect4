import { Cell, defaultCell } from "./cell"

type Board = Cell[][];

function createBoard(ROWS: number, COLUMNS: number): Board {
  return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(defaultCell));
}

export { Board, createBoard };