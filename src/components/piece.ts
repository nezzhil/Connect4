type Piece = {
    state: null | "player1" | "player2"
    value: number
}; 

const defaultPiece: Piece = {
    state: null,
    value: 0
}