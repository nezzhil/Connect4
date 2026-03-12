type Cell = {
    state: null | "player1" | "player2"
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
