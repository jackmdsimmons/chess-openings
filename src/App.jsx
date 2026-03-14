import { useState, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { loadTree, saveTree, addMoveToTree, getMovesAtPosition } from './tree'
import './App.css'

export default function App() {
  const [game, setGame] = useState(new Chess())
  const [tree, setTree] = useState(() => loadTree())
  const [history, setHistory] = useState([])
  const [status, setStatus] = useState('Make a move to start building your repertoire.')

  const currentFen = game.fen()
  const movesAtPosition = getMovesAtPosition(tree, currentFen)

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(game.fen())
    let move
    try {
      move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
    } catch {
      return false
    }
    if (!move) return false

    const prevFen = game.fen()
    const updatedTree = addMoveToTree(tree, prevFen, move.san, gameCopy.fen())
    saveTree(updatedTree)
    setTree(updatedTree)
    setGame(gameCopy)
    setHistory(h => [...h, move.san])
    setStatus(`Saved: ${move.san}`)
    return true
  }

  const undoMove = useCallback(() => {
    const gameCopy = new Chess(game.fen())
    gameCopy.undo()
    setGame(gameCopy)
    setHistory(h => h.slice(0, -1))
    setStatus('Move undone.')
  }, [game])

  const reset = useCallback(() => {
    setGame(new Chess())
    setHistory([])
    setStatus('Make a move to start building your repertoire.')
  }, [])

  return (
    <div className="app">
      <h1>Chess Openings</h1>

      <div className="layout">
        <div className="board-col">
          <Chessboard
            position={currentFen}
            onPieceDrop={onDrop}
            boardWidth={480}
          />
          <div className="controls">
            <button onClick={undoMove} disabled={history.length === 0}>Undo</button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="info-col">
          <div className="panel">
            <h2>Move History</h2>
            <p className="history">
              {history.length === 0
                ? <span className="muted">No moves yet</span>
                : history.map((m, i) => (
                    <span key={i}>
                      {i % 2 === 0 && <span className="move-num">{Math.floor(i / 2) + 1}. </span>}
                      <span className="move">{m} </span>
                    </span>
                  ))
              }
            </p>
          </div>

          <div className="panel">
            <h2>Repertoire at this position</h2>
            {movesAtPosition.length === 0
              ? <p className="muted">No moves saved here yet.</p>
              : <ul className="move-list">
                  {movesAtPosition.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
            }
          </div>

          <div className="panel status">
            <p>{status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
