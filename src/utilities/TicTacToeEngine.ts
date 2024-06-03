import { Board } from "@/types/Board";

export function hasFourInARow(board: Board) {
  // Check for horizontal four in a row
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] !== ' ' &&
        board[row][col] === board[row][col + 1] &&
        board[row][col] === board[row][col + 2] &&
        board[row][col] === board[row][col + 3]
      ) {
        return board[row][col];
      }
    }
  }

  // Check for vertical four in a row
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        board[row][col] !== ' ' &&
        board[row][col] === board[row + 1][col] &&
        board[row][col] === board[row + 2][col] &&
        board[row][col] === board[row + 3][col]
      ) {
        return board[row][col];
      }
    }
  }

  // Check for diagonal (top-left to bottom-right) four in a row
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] !== ' ' &&
        board[row][col] === board[row + 1][col + 1] &&
        board[row][col] === board[row + 2][col + 2] &&
        board[row][col] === board[row + 3][col + 3]
      ) {
        return board[row][col];      }
    }
  }

  // Check for diagonal (top-right to bottom-left) four in a row
  for (let row = 0; row < 3; row++) {
    for (let col = 3; col < 7; col++) {
      if (
        board[row][col] !== ' ' &&
        board[row][col] === board[row + 1][col - 1] &&
        board[row][col] === board[row + 2][col - 2] &&
        board[row][col] === board[row + 3][col - 3]
      ) {
        return board[row][col];
      }
    }
  }

  return null;
}

  export function makeMove(board: Board, col: number, isWhiteTurn: boolean) {    
    if (board[5][col] === " ") {      
      if (hasFourInARow(board)) {
      return board;
      }
      board[5][col] = isWhiteTurn ? "X" : "O";
    }else {
      for (let row = 0; row <= 5; row++) {
        const curPos = board[row][col];         
        if (curPos !== " " && row > 0) {          
          if (hasFourInARow(board)) {
          return board;
          }
          board[row-1][col] = isWhiteTurn ? "X" : "O";
          break;
        }
      }
    }
    return board;
  }

  export function isBoardFull(board: Board): boolean {
    return board.every(row => row.every(cell => cell !== ' '));
}