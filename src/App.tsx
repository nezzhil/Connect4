import { useCallback, useEffect, useRef, useState } from "react";
import { Board, createBoard } from "./components/board";
import "./style/style.css"
import { Cell } from "./components/cell";
import env from "react-dotenv";
import { evalBoard, getDropAI } from "./components/ai";
import { checkWinner, draw, player1, player2 } from "./components/game";
import { Player } from "./components/player";


export default function App() {
  const COLUMNS = parseInt(env.COLUMNS!);
  const ROWS = parseInt(env.ROWS!);
  const CELL_SIZE = parseInt(env.CELL_SIZE!);
  const GAP = parseInt(env.GAP!);
  const [board, setBoard] = useState<Board>(createBoard(ROWS, COLUMNS));
  const [current, setCurrent] = useState<Player>(player1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [droppingPiece, setDroppingPiece] = useState<Cell | null>(null);
  const [ai, setAI] = useState<Boolean>(false);
  const boardRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    boardRef.current?.style.setProperty('grid-template-columns', `repeat(${COLUMNS}, ${CELL_SIZE}px)`)
    boardRef.current?.style.setProperty('gap', `${GAP}px`)
    evalBoard(board);
  }, [])

  useEffect(() => {
    if(current === player2 && ai && droppingPiece == null) {
      dropPiece(getDropAI(board));
    }
  }, [board, current, ai, droppingPiece])

  // Calculate drop animation: piece falls from top of board to targetRow
  const getDropStyle = (piece: Cell): React.CSSProperties => {
    const totalDistance = (piece.y) * (CELL_SIZE + GAP);
    const fallDistance = piece.y + 1;
    const duration = 80 + fallDistance * 60;
    return {
      position: "absolute",
      top: 0,
      left: `${piece.x * (CELL_SIZE + GAP)}px`,
      width: `${CELL_SIZE}px`,
      height: `${CELL_SIZE}px`,
      borderRadius: "50%",
      zIndex: 10,
      animation: `gravityDrop ${duration}ms cubic-bezier(0.33, 0, 0.66, 1) forwards`,
      ["--fall-distance" as string]: `${totalDistance}px`,
      pointerEvents: "none",
    };
  };

  const dropPiece = useCallback((col: number) => {
    if (winner) return;

    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col].state === null) { 
        row = r; break; 
      }
    }
    if (row === -1) return;

    setDroppingPiece({state:current, x: col, y: row, value: 0});

    const fallDistance = row + 1;
    const duration = 80 + fallDistance * 60;
    setTimeout(() => {
      const newBoard = board.map(r => [...r]) as Board;
      newBoard[row][col] = {...newBoard[row][col], state:current, x: col, y: row}; 
    
      setBoard(newBoard);
      setDroppingPiece(null);
      if (checkWinner(newBoard, row, col, current)) {
        setWinner(current);
      } else if (newBoard.every(row => row.every(cell => cell.state !== null))) {
        setWinner(draw);
      } else {
        setCurrent(current === player1 ? player2 : player1);
      }


    }, duration);

  }, [board, current, winner, droppingPiece, ai]);

  const reset = () => {
    setBoard(createBoard(ROWS, COLUMNS));
    setCurrent(player1);
    setDroppingPiece(null);
    setWinner(null);
  };

  const aiToggle = () => {
    setAI(!ai);
  };

    return (
        <>
      <div className="App">
        <div className="title">Connect4</div>

        <div className="status-bar">
          {!winner ? (
            <div className="turn-indicator">
              Player turn {current === player1 ? "Red" : "Blue"}
            </div>)
            : winner === draw ? (<div className={'winner-msg winner-draw'}>
              Draw
            </div>)
            : (<div className={`winner-msg winner-p${winner}`}>
              {winner.Description} wins!
            </div>)
          }
        </div>

        <div className="board-wrap">          
          <div className="board" ref={boardRef}>
            {droppingPiece && (
              <div
                className={`piece-player${droppingPiece.state!.Id}`}
                style={getDropStyle(droppingPiece)}
              />
            )}
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLUMNS }, (_, c) => {
                const cell = board[r][c];
                const isDrop = droppingPiece?.x === r && droppingPiece?.y === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="cell-wrap"
                    onClick={() => dropPiece(c)}
                  >{cell.state !== null && (
                      <div className={`piece piece-player${cell.state.Id} } ${isDrop ? "drop" : ""}`} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button className="reset-btn" onClick={reset}>"START"</button>
        <button className="aiToggle-btn" onClick={aiToggle}>{ai ? "Human" : "AI"}</button>
      </div>
    </>
    )
}
