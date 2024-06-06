"use client"
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { Board } from '@/types/Board';
import { hasFourInARow, makeMove } from '@/utilities/TicTacToeEngine';
import { computersMove } from '@/utilities/AlphaBeta';
import { Cell } from '@/types/Cell';
import { motion } from 'framer-motion';

type TicTacToePageProps = {
  difficulty: number;
  handleGoBackToMenu: () => void;
};

export const TicTacToePage: NextPage<TicTacToePageProps> = ({ difficulty, handleGoBackToMenu }) => {
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
      }, 5000); // 2 seconds delay

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
        const boardCopy = board.map(row => [...row]);
        const computerMoveResult = computersMove(boardCopy, difficulty);
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
      setTimeout(() => alert(`Game is over - ${player === 'X' ? 'you' : 'computer'} did win the game!`), 1000);
      setGameWon(true);
    } else {
      setIsWhiteTurn((cur) => !cur); // Switch turns
    }
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] === ' ' && !gameWon && isWhiteTurn) {

      makeMoveAndUpdateBoard({ row, col }, 'X');
    } else {
      alert('INVALID MOVE');
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <button
        onClick={handleGoBackToMenu}
        className='absolute top-0 left-0 m-4 px-6 py-2 text-[26px] font-medium bg-red-500 text-white w-fit transition-all 
                shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] rounded-xl'>
        Go Back to Menu
      </button>

      <h1 className="text-4xl font-bold mb-12 font-serif">Connect Four!</h1>

      <div className="grid grid-row-3 gap-4">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-4 cursor-pointer">
          {row.map((cell, colIndex) => (
            <button
              className="h-32 w-32 border rounded-lg border-blue-400 bg-neutral-100 flex items-center justify-center font-bold font-mono text-9xl"
              key={colIndex}
              onClick={() => {
                if (gameWon) {
                  alert('GAME IS OVER');
                } else {
                  handleClick(rowIndex, colIndex);
                }
              }}
            >
              {cell === 'X' ? (
                <motion.div
                  initial={{ y: -700, opacity: 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Image src="./white.svg" width={100} height={100} alt="X" />
                </motion.div>
              ) : cell === 'O' ? (
                <motion.div
                  initial={{ y: -700, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Image src="./red.svg" width={100} height={100} alt="O" />
                </motion.div>
              ) : null}
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
