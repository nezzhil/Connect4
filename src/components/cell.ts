import { Player } from "./player";

type Cell = {
    state: null | Player
    x: number,
    y: number,
    value: number
}; 

const defaultCell: Cell = {
    state: null,
    x: -1,
    y: -1,
    value: 0
};

export { Cell, defaultCell }
