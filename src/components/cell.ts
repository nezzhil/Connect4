type Cell = {
    state: null | "player1" | "player2"
    x: number,
    y: number
}; 

const defaultCell: Cell = {
    state: null,
    x: -1,
    y: -1
};

export { Cell, defaultCell }
