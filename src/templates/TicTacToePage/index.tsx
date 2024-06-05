"use client"
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { Board } from '@/types/Board';
import { hasFourInARow, makeMove } from '@/utilities/TicTacToeEngine';
import { computersMove } from '@/utilities/AlphaBeta';
import { Cell } from '@/types/Cell';

export const TicTacToePage: NextPage = () => {
  const [board, setBoard] = useState<Board>(Array.from({ length: 6 }, () => Array(7).fill(" ")));
  const [isWhiteTurn, setIsWhiteTurn] = useState(true); // White / X is player and red / O is computer
  const [gameWon, setGameWon] = useState(false);
  const [possibleNodes, setPossibleNodes] = useState(0);
  const [exploredNodes, setExploredNodes] = useState(0);

  // Reset the game after a win
  useEffect(() => {
    if (gameWon) {
      // Show winning state, then reset after a delay
      setIsWhiteTurn(false);
      const timeout = setTimeout(() => {
        handleReset();
        setGameWon(false); // Reset gameWon to allow a new game to start
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timeout);
    }
  }, [gameWon]);

  const handleReset = () => {
    setBoard(Array.from({ length: 6 }, () => Array(7).fill(" ")));
    setIsWhiteTurn(true);
    setPossibleNodes(0);
    setExploredNodes(0);
  };

  useEffect(() => {
    if (!isWhiteTurn && !gameWon) {
      // Artificial delay to simulate the computer "thinking"
      const delay = 600; // Delay in milliseconds (e.g., 1000ms = 1 second)
      setTimeout(() => {
        const boardCopy = [...board.map(row => [...row])];
        const computerMoveResult = computersMove(boardCopy, 0);
        if (computerMoveResult) {
          const { move, possibleNodes, exploredNodes } = computerMoveResult;
          makeMoveAndUpdateBoard(move, 'O'); // 'O' represents the computer's move
          setPossibleNodes(possibleNodes);
          setExploredNodes(exploredNodes);
        }
      }, delay);
    }
  }, [isWhiteTurn, gameWon]);

  const makeMoveAndUpdateBoard = (move: { row: number; col: number }, player: Cell) => {
    const boardCopy = board.map(row => [...row]);
    const newBoard = makeMove(boardCopy, move.col, isWhiteTurn);
    setBoard(newBoard);

    if (hasFourInARow(newBoard)) {
      setTimeout(() => alert(`Game is over - ${player === 'X' ? 'you' : 'computer'} did win the game!`), 100);
      setGameWon(true);
    } else {
      setIsWhiteTurn((cur) => !cur); // Switch turns
    }
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === ' ' && !gameWon && isWhiteTurn) {
      console.log('Player move:', row, col);
      makeMoveAndUpdateBoard({ row, col }, 'X');
    } else {
      alert('INVALID MOVE');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 font-serif">Fire På Stribe!</h1>

      <div className="grid grid-row-3 gap-4">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-4 cursor-pointer">
            {row.map((cell, colIndex) => (
              <button
                className="h-32 w-32 border rounded-lg border-blue-400 bg-blue-400 flex items-center justify-center font-bold font-mono text-9xl"
                key={colIndex}
                onClick={() => {
                  if (gameWon) {
                    alert('GAME IS OVER');
                  } else {
                    handleClick(rowIndex, colIndex);
                  }
                }}
              >
                {cell === 'X' ? <Image src="./white.svg" width={100} height={100} alt="X" /> : cell === 'O' ? <Image src="./red.svg" width={100} height={100} alt="O" /> : null}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p>Possible Nodes: {possibleNodes}</p>
        <p>Explored Nodes: {exploredNodes}</p>
      </div>
    </div>
  );
};
