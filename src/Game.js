import React, { useState } from 'react';
import Board from './board';
import './Game.css';

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false); // Track game start

  const handleClick = (i) => {
    const historyUpToCurrentStep = history.slice(0, stepNumber + 1);
    const current = historyUpToCurrentStep[historyUpToCurrentStep.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(historyUpToCurrentStep.concat([{ squares: squares }]));
    setStepNumber(historyUpToCurrentStep.length);
    setXIsNext(!xIsNext);

    const winner = calculateWinner(squares);
    if (winner) {
      setWinner(winner);
      setIsPopupVisible(true);
    } else if (squares.every(square => square !== null)) {
      setWinner('None');
      setIsPopupVisible(true);
    }

    setGameStarted(true); // Set game started after first move
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const startNewGame = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setStepNumber(0);
    setXIsNext(true);
    setIsPopupVisible(false);
    setWinner(null);
    setGameStarted(false); // Reset game started state
  };

  const current = history[stepNumber];
  const winnerText = winner === 'None' ? "It's a Draw!" : `Winner: ${winner}`;

  return (
    <div>
      <div className={`game-container ${isPopupVisible ? 'blur' : ''}`}>
        <div className="game-top">
          {!gameStarted && ( // Only show Start button if game hasn't started
            <button className="control-button" onClick={() => { startNewGame(); setGameStarted(true); }}>
              Start Game
            </button>
          )}
          <button className="control-button" onClick={startNewGame}>
            Restart Game
          </button>
        </div>
        <div className="game-board">
          <Board squares={current.squares} onClick={handleClick} />
        </div>
      </div>
      {isPopupVisible && (
        <div className="winner-popup">
          <h2>{winnerText}</h2>
          <button className="control-button" onClick={startNewGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default Game;
