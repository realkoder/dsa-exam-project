import { Board } from "@/types/Board";
import { Cell } from "@/types/Cell";

function checkDirection(board: Board, row: number, col: number, dirRow: number, dirCol: number, symbol: Cell, count: number = 1): boolean {
    const nextRow = row + dirRow;
    const nextCol = col + dirCol;
  
    if (count === 4) {
      return true;
    }
  
    // Base case for failure
    if (nextRow < 0 || nextRow >= board.length || nextCol < 0 || nextCol >= board[0].length || board[nextRow][nextCol] !== symbol) {
      return false;
    }
  
    // Recursive call to continue checking in the direction
    return checkDirection(board, nextRow, nextCol, dirRow, dirCol, symbol, count + 1);
  }
  
  // Checks all directions from a cell to find four in a row
  export function hasFourInARow(board: Board, row: number, col: number, symbol: Cell): boolean {
    const directions = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
      [-1, -1],// Diagonal Up-Left
      [-1, 1], // Diagonal Up-Right
      [1, -1], // Diagonal Down-Left
      [1, 1]   // Diagonal Down-Right
    ];
  
    // Iterate over all directions, check if four in a row exists
    return directions.some(([dirRow, dirCol]) => checkDirection(board, row, col, dirRow, dirCol, symbol));
  }


  export function isBoardFull(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== ' '));
}