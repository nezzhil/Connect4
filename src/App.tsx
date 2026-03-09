import { useCallback, useState } from "react";
import { Board, createBoard } from "./components/board";
import "./style/style.css"


export default function App() {
  const COLUMNS = 7;
  const ROWS = 6;
  const [board, setBoard] = useState<Board>(createBoard(ROWS, COLUMNS));
  const [current, setCurrent] = useState<"player1" | "player2">("player1");
  const [winner, setWinner] = useState<"player1" | "player2" | "draw" | null>(null);

  const dropPiece = useCallback((col: number) => {
    if (winner) return;

  }, [board, current, winner]);

  const reset = () => {
    setBoard(createBoard(ROWS, COLUMNS));
    setCurrent("player1");
  };

    return (
        <>
      <div className="App">
        <div className="title">Connect4</div>

        <div className="status-bar">
          <div className="turn-indicator">
            Player turn {current === "player1" ? "Red" : "Blue"}
          </div>
        </div>

        <div className="board-wrap">          
          <div className="board">
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLUMNS }, (_, c) => {
                const cell = board[r][c];
                return (
                  <div
                    className="cell-wrap"
                  >
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button className="reset-btn" onClick={() => null}>"START"</button>
      </div>
    </>
    )
}
